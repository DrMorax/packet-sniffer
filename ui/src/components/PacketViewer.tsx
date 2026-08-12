import { useEffect, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Packet = {
  timestamp: string
  srcIp: string
  srcPort: number
  dstIp: string
  dstPort: number
  flags: string
  payloadBytes: number
  payload_data: string
}

export function PacketViewer() {
  const [packets, setPackets] = useState<Packet[]>([])

  useEffect(() => {
    let timeoutId: number

    const fetchPackets = () => {
      fetch("http://localhost:4001/packets")
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok")
          return res.json()
        })
        .then((data: Packet[]) => setPackets(data || []))
        .catch((error) => console.error("Fetch error:", error))
        .finally(() => {
          timeoutId = setTimeout(fetchPackets, 100)
        })
    }

    fetchPackets()
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-8">
      <Card className="h-full border-border p-0 shadow-sm">
        <CardHeader className="border-b bg-muted/50 p-6 md:p-8">
          <CardTitle className="flex items-center justify-between text-2xl">
            <span>Live Network Traffic</span>
            <Badge variant="secondary" className="px-3 py-1 font-mono text-sm">
              {packets.length} Packets
            </Badge>
          </CardTitle>

          <div className="flex items-center justify-between px-2 pt-6 text-base font-medium text-muted-foreground">
            <div className="w-1/4">Timestamp</div>
            <div className="w-2/4 text-center">Source &rarr; Destination</div>
            <div className="flex w-1/4 justify-end gap-8">
              <span>Flags</span>
              <span>Size</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Accordion className="w-full">
            {packets.map((packet, index) => {
              const packetId = `packet-${index}`

              return (
                <AccordionItem
                  key={packetId}
                  value={packetId}
                  className="border-b px-6 transition-colors hover:bg-muted/30"
                >
                  <AccordionTrigger className="py-5 hover:no-underline">
                    <div className="flex w-full items-center justify-between font-mono text-base">
                      <div className="w-1/4 text-left text-sm text-muted-foreground">
                        {new Date(packet.timestamp).toLocaleTimeString()}
                      </div>

                      <div className="flex w-2/4 items-center justify-center gap-3 text-center">
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {packet.srcIp}:{packet.srcPort}
                        </span>
                        <span className="text-muted-foreground">&rarr;</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          {packet.dstIp}:{packet.dstPort}
                        </span>
                      </div>

                      <div className="flex w-1/4 items-center justify-end gap-6">
                        <Badge variant="outline" className="px-2 py-1 text-xs">
                          {packet.flags || "NONE"}
                        </Badge>
                        <span className="w-16 text-right text-muted-foreground">
                          {packet.payloadBytes}B
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pb-6">
                    <div className="mt-4 overflow-x-auto rounded-lg bg-zinc-950 p-6 text-zinc-50 shadow-inner">
                      {packet.payloadBytes > 0 ? (
                        <pre className="wrap-break-words font-mono text-sm leading-relaxed whitespace-pre-wrap">
                          {packet.payload_data}
                        </pre>
                      ) : (
                        <span className="text-sm text-zinc-500 italic">
                          No payload data
                        </span>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
