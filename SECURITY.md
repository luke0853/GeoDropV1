# GeoDrop App - Sicherheitsrichtlinien

## Sensible Daten und Konfiguration

### ✅ Was wurde implementiert:

1. **Zentrale Konfiguration**
   - Alle sensiblen Daten sind in `config/config.js` gespeichert
   - Template-Datei `config/config.example.js` für neue Installationen
   - Konfiguration ist global über `window.CONFIG` verfügbar

2. **Git-Schutz**
   - `.gitignore` verhindert das Committen von `config/config.js`
   - Sensible Dateien sind vom Repository ausgeschlossen
   - Template-Dateien sind öffentlich verfügbar

3. **Modulare Struktur**
   - Firebase-Konfiguration wird zentral geladen
   - Blockchain-Konfiguration ist konfigurierbar
   - App-Einstellungen sind zentral verwaltet

### 🔒 Sicherheitsmaßnahmen:

#### Konfigurationsdateien
- `config/config.js` - **NIEMALS committen** (in .gitignore)
- `config/config.example.js` - Template mit Platzhaltern
- `config/README.md` - Dokumentation

#### Geschützte Daten
- Firebase API Keys
- Contract-Adressen
- RPC URLs
- **Telegram Bot Tokens** ⚠️ **KRITISCH**
- **Telegram Chat IDs** ⚠️ **KRITISCH**
- Analytics IDs

#### Best Practices
1. **Verschiedene Umgebungen:**
   - Development: `config/config.dev.js`
   - Staging: `config/config.staging.js`
   - Production: `config/config.prod.js`

2. **Umgebungsvariablen:**
   - Für Production: Verwende echte Environment Variables
   - Für Development: Lokale config.js Datei

3. **Backup-Sicherheit:**
   - Konfigurationsdateien niemals in Backups einschließen
   - Separate Backup-Strategie für sensible Daten

### 🚨 Wichtige Hinweise:

#### Für Entwickler:
- Kopiere `config.example.js` zu `config.js`
- Fülle echte Werte ein
- Teste mit Testnet-Konfiguration
- Verwende niemals Mainnet-Keys in Development

#### Für Production:
- Verwende sichere Hosting-Umgebung
- Setze Environment Variables
- Überwache API-Key Nutzung
- Regelmäßige Key-Rotation

#### Für Deployment:
- Automatische Konfiguration je nach Umgebung
- Sichere Übertragung von Konfigurationsdateien
- Validierung der Konfiguration beim Start

### 📁 Dateistruktur:

```
config/
├── config.js          # Echte Konfiguration (GITIGNORED)
├── config.example.js   # Template für neue Installationen
└── README.md          # Dokumentation

.gitignore             # Schützt sensible Dateien
SECURITY.md           # Diese Datei
```

### 🔧 Verwendung:

```javascript
// Konfiguration abrufen
const firebaseConfig = window.CONFIG.firebase;
const contractAddress = window.CONFIG.blockchain.contracts.geodropRevenue;
const miningConfig = window.CONFIG.mining.machines;
```

### ⚠️ Sicherheitscheckliste:

- [ ] `config/config.js` ist in .gitignore
- [ ] Keine echten API Keys im Repository
- [ ] Template-Datei ist aktuell
- [ ] Verschiedene Konfigurationen für verschiedene Umgebungen
- [ ] Regelmäßige Überprüfung der API-Key Nutzung
- [ ] Sichere Übertragung von Konfigurationsdateien
- [ ] Backup-Strategie für sensible Daten

### 🆘 Bei Sicherheitsvorfällen:

1. **API Keys kompromittiert:**
   - Sofortige Deaktivierung in Firebase Console
   - Neue Keys generieren
   - Alle Umgebungen aktualisieren

2. **Telegram Bot Token kompromittiert:**
   - **SOFORT:** Bot in Telegram deaktivieren
   - Neuen Bot erstellen mit @BotFather
   - Chat-ID neu generieren
   - Alle Umgebungen aktualisieren
   - Chat-Gruppe überprüfen auf unerwünschte Nachrichten

3. **Contract-Adressen geändert:**
   - Konfiguration aktualisieren
   - Alle Umgebungen synchronisieren
   - Benutzer informieren

4. **Repository kompromittiert:**
   - Alle Keys rotieren (Firebase + Telegram)
   - Neue Repository-Struktur
   - Sicherheitsaudit durchführen

### 📱 Telegram-spezifische Sicherheit:

#### Bot Token Sicherheit:
- **NIEMALS** Bot Token in öffentlichen Repositories
- Verwende verschiedene Bots für verschiedene Umgebungen
- Regelmäßige Token-Rotation
- Überwache Bot-Aktivität in Telegram

#### Chat ID Sicherheit:
- Chat-ID ist sensibel (kann für Spam verwendet werden)
- Verwende private Chat-Gruppen
- Überwache Chat auf unerwünschte Nachrichten
- Regelmäßige Chat-ID Überprüfung

#### Telegram-Funktionen:
- Alle Telegram-Funktionen prüfen `enabled` Flag
- Graceful Fallback wenn Telegram deaktiviert
- Logging aller Telegram-Aktivitäten
- Rate-Limiting für Telegram-Nachrichten
