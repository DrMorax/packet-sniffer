package main

import (
	"log"
	"strings"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
)

type Packet struct {
	Timestamp time.Time `json:"timestamp"`
	SrcIP     string    `json:"srcIp"`
	SrcPort   uint16    `json:"srcPort"`
	DstIP     string    `json:"dstIp"`
	DstPort   uint16    `json:"dstPort"`
	Flags     string    `json:"flags"`
	Payload   int       `json:"payloadBytes"`
	PayloadData string    `json:"payload_data"`
}

var (
	packetStore []Packet
	storeMutex  sync.RWMutex
)

func main() {
	go capture("wg0", "tcp")

	app := fiber.New(fiber.Config{
		DisableStartupMessage: true,
	})

	app.Get("/packets", func(c *fiber.Ctx) error {
		storeMutex.RLock()
		defer storeMutex.RUnlock()

		var res []Packet
		if len(packetStore) > 10 {
			res = packetStore[len(packetStore) - 10:]
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

	log.Println("Fiber API listening on :4001")
	log.Fatal(app.Listen(":4001"))
}

func capture(device, bpfFilter string) {
	handle, err := pcap.OpenLive(device, 1600, true, pcap.BlockForever)
	if err != nil {
		log.Fatalf("Error opening device %s: %v", device, err)
	}
	defer handle.Close()

	if err := handle.SetBPFFilter(bpfFilter); err != nil {
		log.Fatalf("Error setting BPF filter: %v", err)
	}

	var ip4 layers.IPv4
	var tcp layers.TCP
	var payload gopacket.Payload
	decoded := make([]gopacket.LayerType, 0, 4)

	parser := gopacket.NewDecodingLayerParser(layers.LayerTypeIPv4, &ip4, &tcp, &payload)
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
			packetStore = append(packetStore, pkt)
			storeMutex.Unlock()
		}
	}
}
