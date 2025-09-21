# AWS Rekognition Setup für GeoDrop

## 🚀 Schnellstart

### 1. AWS Account erstellen
1. Gehe zu [aws.amazon.com](https://aws.amazon.com)
2. Erstelle einen kostenlosen Account
3. Bestätige deine E-Mail-Adresse

### 2. AWS Rekognition aktivieren
1. Gehe zu [AWS Console](https://console.aws.amazon.com)
2. Suche nach "Rekognition"
3. Klicke auf "Amazon Rekognition"
4. Klicke auf "Get started" (kostenlos)

### 3. IAM User erstellen
1. Gehe zu [IAM Console](https://console.aws.amazon.com/iam)
2. Klicke auf "Users" → "Create user"
3. Username: `geodrop-rekognition`
4. Klicke auf "Next"

### 4. Berechtigungen hinzufügen
1. Klicke auf "Attach policies directly"
2. Suche nach "AmazonRekognitionFullAccess"
3. Wähle die Policy aus
4. Klicke auf "Next" → "Create user"

### 5. Access Keys erstellen
1. Klicke auf den erstellten User
2. Gehe zu "Security credentials" Tab
3. Klicke auf "Create access key"
4. Wähle "Application running outside AWS"
5. Kopiere die **Access Key ID** und **Secret Access Key**

### 6. Credentials in GeoDrop einbinden
Öffne `js/aws-rekognition.js` und ersetze:

```javascript
getAccessKeyId() {
    return 'YOUR_AWS_ACCESS_KEY_ID'; // ← Hier deine Access Key ID
}

getSecretAccessKey() {
    return 'YOUR_AWS_SECRET_ACCESS_KEY'; // ← Hier deinen Secret Access Key
}
```

## 💰 Kosten

### Kostenlose Limits (pro Monat):
- ✅ **5.000 Bilder** für Objekterkennung
- ✅ **5.000 Labels** für Bildanalyse
- ✅ **5.000 Gesichtserkennungen**
- ✅ **1.000 Bildvergleiche**

### Geschätzte Kosten für GeoDrop:
- Bei 100 User pro Tag = 3.000 Bilder/Monat
- **Kosten: 0€** (bleibt unter kostenlosen Limits)

## 🔧 Konfiguration

### Region ändern:
In `config/aws-config.js`:
```javascript
region: 'eu-central-1', // Frankfurt, Germany
```

### Andere Regionen:
- `us-east-1` - Virginia, USA
- `us-west-2` - Oregon, USA
- `eu-west-1` - Irland
- `ap-southeast-1` - Singapur

## 🧪 Testen

### 1. AWS Rekognition testen:
```javascript
// In der Browser-Konsole:
window.awsRekognitionService.initialize().then(() => {
    console.log('✅ AWS Rekognition ready!');
});
```

### 2. Bildvalidierung testen:
```javascript
// Test mit einem Bild:
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

window.awsRekognitionService.validateImage(file).then(result => {
    console.log('Validation result:', result);
});
```

## 🚨 Sicherheit

### ⚠️ WICHTIG: Credentials schützen!
- **NIE** die Access Keys in Git committen
- **NIE** die Keys in öffentlichen Repositories teilen
- **NUR** die minimalen Berechtigungen geben

### Empfohlene Sicherheitsmaßnahmen:
1. **Environment Variables** verwenden
2. **Server-side Proxy** für Production
3. **Rate Limiting** implementieren
4. **Monitoring** einrichten

## 🔍 Troubleshooting

### Häufige Probleme:

#### 1. "AWS SDK not loaded"
```html
<!-- Stelle sicher, dass AWS SDK geladen ist -->
<script src="https://sdk.amazonaws.com/js/aws-sdk-2.1490.0.min.js"></script>
```

#### 2. "Access Denied"
- Überprüfe IAM Berechtigungen
- Stelle sicher, dass Rekognition aktiviert ist

#### 3. "Region not supported"
- Ändere die Region in `aws-config.js`
- Stelle sicher, dass Rekognition in der Region verfügbar ist

#### 4. "Monthly limit reached"
- Überprüfe AWS Console → Billing
- Warte bis zum nächsten Monat

## 📊 Monitoring

### Usage Statistics anzeigen:
```javascript
// In der Browser-Konsole:
const stats = window.awsRekognitionService.getUsageStats();
console.log('Usage stats:', stats);
```

### AWS Console Monitoring:
1. Gehe zu [AWS Console](https://console.aws.amazon.com)
2. Suche nach "CloudWatch"
3. Gehe zu "Metrics" → "AWS/Rekognition"

## 🎯 Nächste Schritte

1. ✅ AWS Account erstellen
2. ✅ Rekognition aktivieren
3. ✅ IAM User erstellen
4. ✅ Credentials einbinden
5. ✅ Testen
6. ✅ Production deployen

## 📞 Support

Bei Problemen:
- [AWS Rekognition Dokumentation](https://docs.aws.amazon.com/rekognition/)
- [AWS Support](https://console.aws.amazon.com/support/)
- [GeoDrop GitHub Issues](https://github.com/your-repo/issues)
