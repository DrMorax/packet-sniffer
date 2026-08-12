package main

import (
	"log"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
)

type Packet struct {
	Timestamp   time.Time `json:"timestamp"`
	SrcIP       string    `json:"srcIp"`
	SrcPort     uint16    `json:"srcPort"`
	DstIP       string    `json:"dstIp"`
	DstPort     uint16    `json:"dstPort"`
	Flags       string    `json:"flags"`
	Payload     int       `json:"payloadBytes"`
	PayloadData string    `json:"payload_data"`
}

var (
	packetStore []Packet
	storeMutex  sync.RWMutex
	maxPackets  = 1000
	maxSentPackets = 20
)

func main() {
	if len(os.Args) < 2 {
		log.Fatal("Please specify an interface type: 'eth' or 'wg'")
	}

	mode := os.Args[1]
	var device string
	var isEthernet bool

	switch mode {
	case "eth":
		device = "wlp1s0"
		isEthernet = true
	case "wg":
		device = "wg0"
		isEthernet = false
	default:
		log.Fatalf("Invalid argument '%s'. Use 'eth' or 'wg'", mode)
	}

	go capture(device, "tcp", isEthernet)

	app := fiber.New(fiber.Config{
		DisableStartupMessage: true,
	})

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendFile("./index.html")
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
	}))

	app.Get("/packets", func(c *fiber.Ctx) error {
		storeMutex.RLock()
		defer storeMutex.RUnlock()

		var res []Packet
		if len(packetStore) > maxSentPackets {
			res = packetStore[len(packetStore)-maxSentPackets:]
		} else {
			res = packetStore
		}

		return c.JSON(res)
	})

	app.Delete("/packets", func(c *fiber.Ctx) error {
		storeMutex.Lock()
		defer storeMutex.Unlock()
		packetStore = []Packet{}
		return c.SendStatus(fiber.StatusNoContent)
	})

	log.Printf("Capturing on %s. Fiber API listening on :4001\n", device)
	log.Fatal(app.Listen(":4001"))
}

func capture(device, bpfFilter string, isEthernet bool) {
	handle, err := pcap.OpenLive(device, 1600, true, pcap.BlockForever)
	if err != nil {
		log.Fatalf("Error opening device %s: %v", device, err)
	}
	defer handle.Close()

	if err := handle.SetBPFFilter(bpfFilter); err != nil {
		log.Fatalf("Error setting BPF filter: %v", err)
	}

	var eth layers.Ethernet
	var ip4 layers.IPv4
	var tcp layers.TCP
	var payload gopacket.Payload
	decoded := make([]gopacket.LayerType, 0, 5)

	var parser *gopacket.DecodingLayerParser
	if isEthernet {
		parser = gopacket.NewDecodingLayerParser(layers.LayerTypeEthernet, &eth, &ip4, &tcp, &payload)
	} else {
		parser = gopacket.NewDecodingLayerParser(layers.LayerTypeIPv4, &ip4, &tcp, &payload)
	}
	parser.IgnoreUnsupported = true

	for {
		data, ci, err := handle.ReadPacketData()
		if err != nil {
			continue
		}

		err = parser.DecodeLayers(data, &decoded)
		if err != nil {
			continue
		}

		var pkt Packet
		pkt.Timestamp = ci.Timestamp
		var hasTCP bool

		for _, layerType := range decoded {
			switch layerType {
			case layers.LayerTypeIPv4:
				pkt.SrcIP = ip4.SrcIP.String()
				pkt.DstIP = ip4.DstIP.String()
			case layers.LayerTypeTCP:
				hasTCP = true
				pkt.SrcPort = uint16(tcp.SrcPort)
				pkt.DstPort = uint16(tcp.DstPort)

				var activeFlags []string
				if tcp.SYN { activeFlags = append(activeFlags, "SYN") }
				if tcp.ACK { activeFlags = append(activeFlags, "ACK") }
				if tcp.PSH { activeFlags = append(activeFlags, "PSH") }
				if tcp.FIN { activeFlags = append(activeFlags, "FIN") }
				if tcp.RST { activeFlags = append(activeFlags, "RST") }
				if tcp.URG { activeFlags = append(activeFlags, "URG") }
				pkt.Flags = "[" + strings.Join(activeFlags, "|") + "]"

			case gopacket.LayerTypePayload:
				pkt.Payload = len(payload)
				pkt.PayloadData = string(payload)
			}
		}

		if hasTCP && pkt.SrcIP != "" {
			storeMutex.Lock()
			if len(packetStore) >= maxPackets {
				packetStore = packetStore[1:]
			}
			packetStore = append(packetStore, pkt)
			storeMutex.Unlock()
		}
	}
}
