# 🍓 GeoDrop auf Raspberry Pi mit Pimatic Setup

## Voraussetzungen ✅
- Raspberry Pi mit Pimatic bereits installiert
- Node.js (wahrscheinlich bereits vorhanden)
- Git (falls nicht vorhanden)

## 1. System prüfen und vorbereiten

```bash
# Aktuelle Node.js Version prüfen
node --version
npm --version

# Falls Node.js fehlt oder zu alt ist:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git installieren (falls nicht vorhanden)
sudo apt install git -y

# In das gewünschte Verzeichnis wechseln (neben Pimatic)
cd /home/pi
```

## 2. GeoDrop installieren

```bash
# GeoDrop Repository klonen
git clone https://github.com/luke0853/GeoDropV1.git
cd GeoDropV1

# Dependencies installieren
npm install

# Berechtigungen setzen
sudo chown -R pi:pi /home/pi/GeoDropV1
```

## 3. Konfiguration anpassen

### Firebase Konfiguration
```bash
# Konfigurationsdatei erstellen
cp config/config.example.js config/config-secrets.js

# Mit Nano bearbeiten
nano config/config-secrets.js
```

**Inhalt der config-secrets.js:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBbaHV1OY9C_MUt4o3WTkHCGlRVt7ll9UA",
    authDomain: "geodrop-v1.firebaseapp.com",
    projectId: "geodrop-v1",
    storageBucket: "geodrop-v1.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    measurementId: "G-RBEJES6HX1"
};

module.exports = firebaseConfig;
```

### Server Port anpassen (wichtig für Pimatic Koexistenz)
```bash
# Server.js bearbeiten
nano server.js
```

**Port ändern von 3000 auf 3001 (falls Pimatic Port 3000 verwendet):**
```javascript
const PORT = 3001;  // Ändere von 3000 auf 3001
```

## 4. Nginx Konfiguration (falls bereits vorhanden)

### Bestehende Nginx Config erweitern
```bash
# Aktuelle Nginx Config anzeigen
sudo nginx -t
sudo cat /etc/nginx/sites-available/default

# Neue GeoDrop Config erstellen
sudo nano /etc/nginx/sites-available/geodrop
```

**Inhalt für GeoDrop:**
```nginx
server {
    listen 8080;  # Anderer Port als Pimatic
    server_name _;
    
    # Root Directory
    root /home/pi/GeoDropV1;
    index index.html;
    
    # Static Files
    location / {
        try_files $uri $uri/ @nodejs;
    }
    
    # Node.js Proxy
    location @nodejs {
        proxy_pass http://localhost:3001;  # Port 3001 für GeoDrop
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # API Routes
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Nginx aktivieren
```bash
# Site aktivieren
sudo ln -s /etc/nginx/sites-available/geodrop /etc/nginx/sites-enabled/

# Nginx testen
sudo nginx -t

# Nginx neu starten
sudo systemctl restart nginx
```

## 5. Systemd Service erstellen

```bash
sudo nano /etc/systemd/system/geodrop.service
```

**Inhalt:**
```ini
[Unit]
Description=GeoDrop App
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/GeoDropV1
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
```

### Service aktivieren
```bash
# Service aktivieren
sudo systemctl daemon-reload
sudo systemctl enable geodrop
sudo systemctl start geodrop

# Status prüfen
sudo systemctl status geodrop
```

## 6. Firewall konfigurieren

```bash
# Firewall Status prüfen
sudo ufw status

# GeoDrop Port freigeben
sudo ufw allow 3001
sudo ufw allow 8080  # Falls Nginx verwendet wird

# Firewall neu laden
sudo ufw reload
```

## 7. Pimatic Integration

### Pimatic Dashboard erweitern
```bash
# Pimatic Config bearbeiten
nano /home/pi/pimatic-app/config.json
```

**GeoDrop Widget hinzufügen:**
```json
{
  "pages": [
    {
      "id": "geodrop",
      "title": "GeoDrop",
      "sections": [
        {
          "title": "GeoDrop App",
          "items": [
            {
              "id": "geodrop-link",
              "type": "text",
              "text": "<a href='http://localhost:8080' target='_blank'>🌍 GeoDrop öffnen</a>"
            }
          ]
        }
      ]
    }
  ]
}
```

### Pimatic Plugin für GeoDrop (optional)
```bash
# In Pimatic Verzeichnis
cd /home/pi/pimatic-app

# Custom Plugin erstellen
mkdir -p plugins/geodrop
nano plugins/geodrop/geodrop.coffee
```

**Plugin Inhalt:**
```coffeescript
module.exports = (env) ->
  Promise = env.require 'bluebird'
  assert = env.require 'cassert'
  M = env.matcher
  _ = env.require 'lodash'
  http = require 'http'

  class GeoDropPlugin extends env.plugins.Plugin

    init: (app, @framework, @config) =>
      @framework.ruleManager.addRuleProvider(new GeoDropRuleProvider @framework)
      
      # GeoDrop Status Device
      @framework.deviceManager.registerDeviceClass("GeoDropStatus", {
        configDef: {
          class: "GeoDropStatus",
          label: "GeoDrop Status",
          inputs: []
        },
        createCallback: (config, lastState) => new GeoDropStatus(config, lastState, @framework)
      })

  class GeoDropStatus extends env.devices.Device
    constructor: (@config, lastState, @framework) ->
      @name = @config.name
      @id = @config.id
      
      @attributes = {
        status: {
          label: "Status"
          type: "string"
        }
        users: {
          label: "Aktive User"
          type: "number"
        }
      }
      
      super()
      
      # Status alle 5 Minuten aktualisieren
      setInterval =>
        @updateStatus()
      , 300000
      
      @updateStatus()

    updateStatus: ->
      http.get 'http://localhost:3001/api/status', (res) =>
        data = ''
        res.on 'data', (chunk) => data += chunk
        res.on 'end', =>
          try
            status = JSON.parse data
            @emit 'status', status.status
            @emit 'users', status.users
          catch error
            @emit 'status', 'offline'

  class GeoDropRuleProvider extends env.rules.RuleProvider
    constructor: (@framework) ->
      super()

  return GeoDropPlugin
```

## 8. Monitoring Script

```bash
# Monitoring Script erstellen
nano /home/pi/monitor-services.sh
```

**Inhalt:**
```bash
#!/bin/bash
# Pimatic + GeoDrop Monitoring Script

echo "=== Raspberry Pi Services Status ==="
echo ""

echo "🔧 Pimatic Status:"
systemctl is-active pimatic
echo ""

echo "🌍 GeoDrop Status:"
systemctl is-active geodrop
echo ""

echo "🌐 Nginx Status:"
systemctl is-active nginx
echo ""

echo "📊 Memory Usage:"
free -h
echo ""

echo "💾 Disk Usage:"
df -h /home/pi
echo ""

echo "🔌 Network Connections:"
echo "Pimatic (Port 80/443):"
netstat -tlnp | grep :80
netstat -tlnp | grep :443
echo ""
echo "GeoDrop (Port 3001):"
netstat -tlnp | grep :3001
echo ""

echo "📝 Recent Logs:"
echo "Pimatic:"
journalctl -u pimatic -n 3 --no-pager
echo ""
echo "GeoDrop:"
journalctl -u geodrop -n 3 --no-pager
```

```bash
# Script ausführbar machen
chmod +x /home/pi/monitor-services.sh

# Testen
./monitor-services.sh
```

## 9. Backup Script für beide Services

```bash
# Backup Script erstellen
nano /home/pi/backup-all.sh
```

**Inhalt:**
```bash
#!/bin/bash
# Pimatic + GeoDrop Backup Script

BACKUP_DIR="/home/pi/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup Verzeichnis erstellen
mkdir -p $BACKUP_DIR

echo "🔄 Erstelle Backup vom $DATE..."

# Pimatic Backup
echo "📦 Backup Pimatic..."
tar -czf $BACKUP_DIR/pimatic_backup_$DATE.tar.gz -C /home/pi pimatic-app

# GeoDrop Backup
echo "🌍 Backup GeoDrop..."
tar -czf $BACKUP_DIR/geodrop_backup_$DATE.tar.gz -C /home/pi GeoDropV1

# System Config Backup
echo "⚙️ Backup System Config..."
tar -czf $BACKUP_DIR/system_config_$DATE.tar.gz /etc/nginx/sites-available/ /etc/systemd/system/geodrop.service

# Alte Backups löschen (älter als 7 Tage)
find $BACKUP_DIR -name "*_backup_*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "system_config_*.tar.gz" -mtime +7 -delete

echo "✅ Backup abgeschlossen!"
echo "📁 Backup Verzeichnis: $BACKUP_DIR"
ls -la $BACKUP_DIR/*_$DATE.tar.gz
```

```bash
# Script ausführbar machen
chmod +x /home/pi/backup-all.sh

# Cron Job für tägliches Backup
crontab -e
# Füge hinzu: 0 3 * * * /home/pi/backup-all.sh
```

## 10. Zugriff testen

### Services prüfen
```bash
# Alle Services Status
sudo systemctl status pimatic
sudo systemctl status geodrop
sudo systemctl status nginx

# Ports prüfen
netstat -tlnp | grep -E ":(80|443|3001|8080)"
```

### Browser Test
- **Pimatic:** `http://deine-raspberry-pi-ip` oder `http://deine-raspberry-pi-ip:80`
- **GeoDrop:** `http://deine-raspberry-pi-ip:8080` oder `http://deine-raspberry-pi-ip:3001`

## 11. Pimatic Dashboard Integration

### GeoDrop Widget in Pimatic
```bash
# Pimatic Config erweitern
nano /home/pi/pimatic-app/config.json
```

**Widget hinzufügen:**
```json
{
  "pages": [
    {
      "id": "home",
      "title": "Home",
      "sections": [
        {
          "title": "Services",
          "items": [
            {
              "id": "pimatic-status",
              "type": "text",
              "text": "🏠 Pimatic läuft"
            },
            {
              "id": "geodrop-link",
              "type": "text", 
              "text": "<a href='http://localhost:8080' target='_blank' style='color: #3b82f6; text-decoration: none;'>🌍 GeoDrop öffnen</a>"
            }
          ]
        }
      ]
    }
  ]
}
```

## 12. Troubleshooting

### Häufige Probleme

**Port Konflikte:**
```bash
# Alle verwendeten Ports anzeigen
sudo netstat -tlnp | grep -E ":(80|443|3000|3001|8080)"

# Service neu starten
sudo systemctl restart geodrop
sudo systemctl restart pimatic
```

**Memory Probleme:**
```bash
# Memory Usage prüfen
free -h
ps aux --sort=-%mem | head -10

# Swap aktivieren falls nötig
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile
# CONF_SWAPSIZE=1024
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

**Logs prüfen:**
```bash
# GeoDrop Logs
sudo journalctl -u geodrop -f

# Pimatic Logs
sudo journalctl -u pimatic -f

# Nginx Logs
sudo tail -f /var/log/nginx/error.log
```

## 13. Wartung

### Regelmäßige Updates
```bash
# System Updates
sudo apt update && sudo apt upgrade -y

# Pimatic Updates
cd /home/pi/pimatic-app
npm update

# GeoDrop Updates
cd /home/pi/GeoDropV1
npm update

# Services neu starten
sudo systemctl restart pimatic
sudo systemctl restart geodrop
```

### Performance Monitoring
```bash
# System Performance
htop

# Disk Usage
df -h

# Network Usage
iftop

# Service Status
./monitor-services.sh
```

---

## 🎯 Zusammenfassung

Nach diesem Setup haben Sie:

✅ **Pimatic läuft weiterhin normal**  
✅ **GeoDrop läuft parallel auf Port 3001/8080**  
✅ **Beide Services sind über Systemd verwaltet**  
✅ **Monitoring für beide Services**  
✅ **Backup für beide Services**  
✅ **Integration in Pimatic Dashboard**  

**Zugriff:**
- **Pimatic:** `http://deine-raspberry-pi-ip`
- **GeoDrop:** `http://deine-raspberry-pi-ip:8080`

**Vorteile:**
- Beide Services laufen parallel
- Keine Konflikte zwischen Pimatic und GeoDrop
- Einheitliche Verwaltung über Systemd
- Monitoring und Backup für beide Services
- Integration in bestehende Pimatic-Infrastruktur
