# Packet sniffer

A TCP packet sniffer.
Can capture data including:
- Time stamp
- Source IP
- Destination IP
- Source Port
- Destination Port
- Control Flags
- Payload size
- Payload data

## Requirements
- Go language compiler
- Node package manager


## Usage

```bash
git clone https://github.com/DrMorax/packet-sniffer.git
```
```bash
cd sniffer && sudo go run ./cmd/main.go <your network interface>
```

and in another tab: 
```bash
cd ui && npm i && npm run dev
```

Finally, open up `http://localhost:3000` and you'll get a live stream of TCP packets sent by you or headed your way



