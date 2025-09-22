# 🍓 GeoDrop auf Raspberry Pi Setup

## Voraussetzungen

### Hardware
- Raspberry Pi 4 (4GB RAM empfohlen)
- MicroSD Karte (32GB+ empfohlen)
- Stabile Internetverbindung
- Optional: UPS für Stromausfall-Schutz

### Software
- Raspberry Pi OS (Bullseye oder neuer)
- Node.js 16+ 
- Nginx
- Git

## 1. System vorbereiten

```bash
# System aktualisieren
sudo apt update && sudo apt upgrade -y

# Node.js installieren (Version 18)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Nginx installieren
sudo apt install nginx -y

# Git installieren (falls nicht vorhanden)
sudo apt install git -y

# Firewall konfigurieren
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 3000  # GeoDrop (temporär für Tests)
sudo ufw enable
```

## 2. GeoDrop installieren

```bash
# In das gewünschte Verzeichnis wechseln
cd /home/pi

# GeoDrop Repository klonen
git clone https://github.com/luke0853/GeoDropV1.git
cd GeoDropV1

# Dependencies installieren
npm install

# Berechtigungen setzen
sudo chown -R pi:pi /home/pi/GeoDropV1
```

## 3. Konfiguration

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

### AWS Konfiguration (optional)
```bash
# AWS Konfiguration
nano config/aws-config.js
```

## 4. Nginx Konfiguration

### Nginx Config erstellen
```bash
sudo nano /etc/nginx/sites-available/geodrop
```

**Inhalt:**
```nginx
server {
    listen 80;
    server_name dein-domain.de;  # Ersetze mit deiner Domain oder IP
    
    # Redirect HTTP zu HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dein-domain.de;  # Ersetze mit deiner Domain oder IP
    
    # SSL Konfiguration (wird später mit Let's Encrypt erstellt)
    ssl_certificate /etc/letsencrypt/live/dein-domain.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dein-domain.de/privkey.pem;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Root Directory
    root /home/pi/GeoDropV1;
    index index.html;
    
    # Static Files
    location / {
        try_files $uri $uri/ @nodejs;
    }
    
    # Node.js Proxy
    location @nodejs {
        proxy_pass http://localhost:3000;
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
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
}
```

### Nginx aktivieren
```bash
# Site aktivieren
sudo ln -s /etc/nginx/sites-available/geodrop /etc/nginx/sites-enabled/

# Default Site deaktivieren
sudo rm /etc/nginx/sites-enabled/default

# Nginx testen
sudo nginx -t

# Nginx neu starten
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## 5. SSL/HTTPS mit Let's Encrypt

```bash
# Certbot installieren
sudo apt install certbot python3-certbot-nginx -y

# SSL Zertifikat erstellen (ersetze dein-domain.de)
sudo certbot --nginx -d dein-domain.de

# Auto-Renewal testen
sudo certbot renew --dry-run
```

## 6. Systemd Service erstellen

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
Environment=PORT=3000

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

## 7. Pimatic Integration (optional)

### Pimatic Plugin für GeoDrop
```bash
# In Pimatic Verzeichnis
cd /home/pi/pimatic-app
npm install pimatic-geodrop  # Falls verfügbar
```

### Pimatic Config erweitern
```json
{
  "plugins": [
    {
      "plugin": "geodrop",
      "active": true,
      "config": {
        "geodropUrl": "http://localhost:3000",
        "apiKey": "dein-api-key"
      }
    }
  ]
}
```

## 8. Monitoring und Logs

### Logs anzeigen
```bash
# GeoDrop Logs
sudo journalctl -u geodrop -f

# Nginx Logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System Logs
sudo tail -f /var/log/syslog
```

### Monitoring Script
```bash
# Monitoring Script erstellen
nano /home/pi/monitor-geodrop.sh
```

**Inhalt:**
```bash
#!/bin/bash
# GeoDrop Monitoring Script

echo "=== GeoDrop Status ==="
echo "Service Status:"
systemctl is-active geodrop
echo ""

echo "Memory Usage:"
ps aux | grep node | grep -v grep
echo ""

echo "Disk Usage:"
df -h /home/pi/GeoDropV1
echo ""

echo "Network Connections:"
netstat -tlnp | grep :3000
echo ""

echo "Last 10 Log Entries:"
journalctl -u geodrop -n 10 --no-pager
```

```bash
# Script ausführbar machen
chmod +x /home/pi/monitor-geodrop.sh
```

## 9. Backup Script

```bash
# Backup Script erstellen
nano /home/pi/backup-geodrop.sh
```

**Inhalt:**
```bash
#!/bin/bash
# GeoDrop Backup Script

BACKUP_DIR="/home/pi/backups/geodrop"
DATE=$(date +%Y%m%d_%H%M%S)
SOURCE_DIR="/home/pi/GeoDropV1"

# Backup Verzeichnis erstellen
mkdir -p $BACKUP_DIR

# Backup erstellen
tar -czf $BACKUP_DIR/geodrop_backup_$DATE.tar.gz -C /home/pi GeoDropV1

# Alte Backups löschen (älter als 7 Tage)
find $BACKUP_DIR -name "geodrop_backup_*.tar.gz" -mtime +7 -delete

echo "Backup erstellt: geodrop_backup_$DATE.tar.gz"
```

```bash
# Script ausführbar machen
chmod +x /home/pi/backup-geodrop.sh

# Cron Job für tägliches Backup
crontab -e
# Füge hinzu: 0 2 * * * /home/pi/backup-geodrop.sh
```

## 10. Performance Optimierung

### Node.js Optimierung
```bash
# PM2 für besseres Process Management
sudo npm install -g pm2

# PM2 Config erstellen
nano /home/pi/GeoDropV1/ecosystem.config.js
```

**Inhalt:**
```javascript
module.exports = {
  apps: [{
    name: 'geodrop',
    script: 'server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/pi/logs/geodrop-error.log',
    out_file: '/home/pi/logs/geodrop-out.log',
    log_file: '/home/pi/logs/geodrop.log',
    time: true
  }]
};
```

### System Optimierung
```bash
# Swap aktivieren (falls nicht vorhanden)
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile
# CONF_SWAPSIZE=1024
sudo dphys-swapfile setup
sudo dphys-swapfile swapon

# GPU Memory reduzieren (für mehr RAM)
sudo nano /boot/config.txt
# gpu_mem=16
```

## 11. Zugriff testen

### Lokaler Zugriff
```bash
# Service Status prüfen
sudo systemctl status geodrop

# Port prüfen
netstat -tlnp | grep :3000

# Lokal testen
curl http://localhost:3000
```

### Externer Zugriff
- Öffne Browser: `https://dein-domain.de`
- Oder mit IP: `https://deine-raspberry-pi-ip`

## 12. Troubleshooting

### Häufige Probleme

**Service startet nicht:**
```bash
sudo journalctl -u geodrop -n 50
```

**Port bereits belegt:**
```bash
sudo lsof -i :3000
sudo kill -9 PID
```

**Nginx Fehler:**
```bash
sudo nginx -t
sudo systemctl status nginx
```

**Firewall Probleme:**
```bash
sudo ufw status
sudo ufw allow 3000
```

## 13. Wartung

### Regelmäßige Updates
```bash
# System Updates
sudo apt update && sudo apt upgrade -y

# Node.js Dependencies
cd /home/pi/GeoDropV1
npm update

# Service neu starten
sudo systemctl restart geodrop
```

### Log Rotation
```bash
sudo nano /etc/logrotate.d/geodrop
```

**Inhalt:**
```
/home/pi/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 pi pi
    postrotate
        systemctl reload geodrop
    endscript
}
```

---

## 🎯 Zusammenfassung

Nach diesem Setup haben Sie:

✅ **GeoDrop läuft auf Raspberry Pi**  
✅ **SSL/HTTPS Verschlüsselung**  
✅ **Automatische Backups**  
✅ **Monitoring und Logs**  
✅ **Integration mit Pimatic möglich**  
✅ **24/7 Verfügbarkeit**  

**Zugriff:** `https://dein-domain.de` oder `https://deine-raspberry-pi-ip`

**Vorteile:**
- Vollständige Kontrolle über Ihre Daten
- Keine monatlichen Hosting-Kosten
- Lokale Integration mit Pimatic
- Erweiterte Sicherheit durch lokalen Server
