# GeoDrop App Konfiguration

Dieses Verzeichnis enthält die Konfigurationsdateien für die GeoDrop App.

## Dateien

- `config.js` - Hauptkonfigurationsdatei mit allen Einstellungen
- `config.example.js` - Template-Datei für neue Installationen
- `README.md` - Diese Dokumentation

## Setup

1. **Kopiere die Template-Datei:**
   ```bash
   cp config/config.example.js config/config.js
   ```

2. **Fülle die echten Werte ein:**
   - Firebase-Konfiguration aus der Firebase Console
   - Blockchain-Konfiguration (RPC URLs, Contract-Adressen)
   - App-spezifische Einstellungen

3. **Sicherheit:**
   - Die `config.js` Datei ist in `.gitignore` eingetragen
   - Niemals sensible Daten in das Repository committen
   - Verwende verschiedene Konfigurationen für Development/Production

## Konfigurationsbereiche

### Firebase
- API Keys und Projekt-Konfiguration
- Wird automatisch von `js/firebase.js` geladen

### Blockchain
- BSC Testnet/Mainnet Konfiguration
- Contract-Adressen
- RPC URLs

### App
- Allgemeine App-Einstellungen
- Debug-Modus
- Standard-Location

### Mining
- Mining-Machine Konfiguration
- Diminishing Returns Einstellungen

### Trading
- Trading-Limits und Einstellungen
- Unterstützte Tokens

### UI
- Theme und Sprache
- Animation-Einstellungen

### Telegram
- Bot Token und Chat ID
- Aktivierung/Deaktivierung
- Benachrichtigungen

## Verwendung

Die Konfiguration ist global über `window.CONFIG` verfügbar:

```javascript
// Beispiel: Firebase-Konfiguration abrufen
const firebaseConfig = window.CONFIG.firebase;

// Beispiel: Mining-Machine Kosten abrufen
const basicMinerCost = window.CONFIG.mining.machines[1].cost;

// Beispiel: Telegram-Konfiguration abrufen
const telegramConfig = window.CONFIG.telegram;
const isTelegramEnabled = window.CONFIG.telegram.enabled;
```

## Sicherheitshinweise

⚠️ **Wichtig:** 
- Niemals echte API Keys oder sensible Daten in das Repository committen
- Verwende verschiedene Konfigurationen für verschiedene Umgebungen
- Die `config.js` Datei sollte niemals öffentlich zugänglich sein
