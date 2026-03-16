# Deploy (systemd)

Run the app as a systemd service so it starts on boot and restarts on failure.

## Prerequisites

- This repo cloned on the server (e.g. `/home/guessr/wikidata-guessr-colombia`).
- Python 3 installed.

## Install the app service

1. From the repo root, copy the unit file and adjust **User**, **Group**, and **WorkingDirectory** to your user and repo path:

   ```bash
   sudo cp deploy/wikidata-guessr.service /etc/systemd/system/
   sudo edit /etc/systemd/system/wikidata-guessr.service
   # Set User=, Group=, WorkingDirectory= to your values
   ```

2. Enable and start:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable wikidata-guessr
   sudo systemctl start wikidata-guessr
   sudo systemctl status wikidata-guessr
   ```

The app listens on **port 8001** (localhost or all interfaces, depending on your unit).

## Exposing the app

- **Reverse proxy (nginx, Caddy, etc.)**: Point a vhost to `http://127.0.0.1:8001`.
- **Direct port**: If the unit binds to `0.0.0.0:8001`, you can open the port in the firewall (less secure; prefer a reverse proxy).


## Updating production

1. On the server, update the repo (e.g. `git pull` in `WorkingDirectory`). No need to restart the service for static file changes.
2. CSS and JS are loaded with `?v=2` in `index.html` so browsers fetch the new files instead of using cache. When you change CSS or JS, bump the version (e.g. `?v=3`) in `index.html`.

## Useful commands

```bash
# Logs
sudo journalctl -u wikidata-guessr -f

# Restart after updating the app
sudo systemctl restart wikidata-guessr

# Check the app responds
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8001/
```

## Troubleshooting

- **Page not loading**: Ensure the app is running (`sudo systemctl status wikidata-guessr`) and something is listening on 8001 (`ss -tlnp | grep 8001`). Test locally with `curl -I http://127.0.0.1:8001/`.
