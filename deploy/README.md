# Deployment for guessr.osm.lat

Systemd services to run the app and Cloudflare Tunnel at server boot.

## Prerequisites on server (192.168.0.5)

1. App deployed at `/home/angoca/wikidata-guessr-colombia` (clone this repo there).
2. Python 3 installed.
3. `cloudflared` installed and tunnel configured in `~/.cloudflared/` (config.yml + credentials).

## Install services

From your **local machine** (or copy these commands to run on the server):

```bash
# Copy service files to the server
scp deploy/wikidata-guessr.service deploy/cloudflared-tunnel.service 192.168.0.5:~/

# SSH to server and install
ssh 192.168.0.5
sudo mv ~/wikidata-guessr.service ~/cloudflared-tunnel.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable wikidata-guessr cloudflared-tunnel
sudo systemctl start wikidata-guessr cloudflared-tunnel
sudo systemctl status wikidata-guessr cloudflared-tunnel
```

## Ensure app is deployed

On the server, if the repo is not yet cloned:

```bash
cd /home/angoca
git clone https://github.com/OSM-Colombia/wikidata-guessr-colombia.git
# or clone from your actual repo URL
```

## Useful commands

```bash
# Logs
sudo journalctl -u wikidata-guessr -f
sudo journalctl -u cloudflared-tunnel -f

# Restart after updating the app
sudo systemctl restart wikidata-guessr
```

## DNS

In Cloudflare, ensure `guessr.osm.lat` is a **CNAME** to:
`f07f48d3-38eb-47a0-b695-367db9a195a0.cfargotunnel.com`
