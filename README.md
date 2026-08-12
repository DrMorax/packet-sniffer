to run the sniffer on your local machine:

```bash
cd sniffer && sudo go run main.go <your network interface>
```

and fetching `http://localhost:4001/packets` will return the captured packets
