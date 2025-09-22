// GeoDrop Language System
// Handles German/English language switching

const LANGUAGES = {
    de: {
        // Navigation
        'nav.start': 'Start',
        'nav.geocard': 'GeoCard',
        'nav.geoboard': 'GeoBoard',
        'nav.mining': 'Mining',
        'nav.bonus': 'Bonus',
        'nav.geochat': 'GeoChat',
        'nav.trading': 'Trading',
        'nav.mehr': 'Mehr',
        
        // Settings
        'settings.title': 'Einstellungen',
        'settings.username': 'Benutzername',
        'settings.username.placeholder': 'Benutzername',
        'settings.username.save': 'Speichern',
        'settings.username.tip': 'Der Benutzername ersetzt deine E-Mail-Adresse im Spiel',
        'settings.email.title': 'E-Mail Einstellungen',
        'settings.email.current': 'Aktuelle E-Mail:',
        'settings.email.new': 'Neue E-Mail:',
        'settings.email.password': 'Passwort bestätigen:',
        'settings.email.update': 'E-Mail aktualisieren',
        'settings.notifications.title': 'Benachrichtigungen',
        'settings.notifications.email': 'E-Mail Benachrichtigungen',
        'settings.notifications.push': 'Push Benachrichtigungen',
        'settings.notifications.daily': 'Tägliche Updates',
        'settings.notifications.save': 'Einstellungen speichern',
        'settings.language.title': 'Sprache',
        'settings.language.german': 'Deutsch',
        'settings.language.english': 'English',
        'settings.language.save': 'Sprache speichern',
        'settings.language.tip': 'Die Sprache wird nach dem Speichern geändert',
        
        // Mehr Tabs
        'mehr.dashboard': 'Dashboard',
        'mehr.profile': 'Profil',
        'mehr.settings': 'Einstellungen',
        'mehr.stats': 'Statistiken',
        'mehr.leitfaden': 'Leitfaden',
        'mehr.impressum': 'Impressum',
        
        // Messages
        'message.username.required': 'Bitte Benutzername eingeben!',
        'message.username.saved': 'Benutzername gespeichert!',
        'message.notifications.saved': 'Benachrichtigungseinstellungen gespeichert!',
        'message.language.changed': 'Sprache geändert zu Deutsch',
        'message.language.changed.en': 'Sprache geändert zu English',
        'message.language.select': 'Bitte wähle eine Sprache aus!',
        'message.language.save.error': 'Fehler beim Speichern der Sprache!',
        'message.language.system.error': 'Sprachsystem nicht verfügbar!',
        
        // Page Content
        'page.welcome': 'Willkommen bei der Zukunft des Geo-Minings',
        'page.user.info': 'Benutzerinfo',
        'page.user.email': 'E-Mail:',
        'page.user.username': 'Benutzername:',
        'page.user.level': 'Level:',
        'page.user.coins': 'Coins:',
        'page.user.drops': 'Drops:',
        'page.user.boost': 'Boost:',
        
        // Landing Page
        'landing.learn.more': 'Erfahre mehr über das GeoDrop Konzept und die Technologie dahinter.',
        'landing.daily.bonus': 'Täglicher Bonus',
        'landing.referral.percent': '+5% von Käufen',
        'landing.discover.features': 'Entdecke die revolutionären Features der Geo-Mining App',
        'landing.geocaching.desc': 'Finde virtuelle Drops an realen Orten und verdiene Kryptowährungen durch Geocaching-Aktivitäten.',
        'landing.mining.desc': '4 verschiedene Maschinentypen für passive Einnahmen. Von Basic bis Mega Miner mit unterschiedlichen Boosts.',
        'landing.trading.desc': 'Handel PixelDrop ↔ tBNB direkt in der App. Vollständiges DeFi-Trading mit Smart Contracts.',
        'landing.daily.bonuses': 'Tägliche Boni',
        'landing.daily.bonus.desc': 'Sammle täglich 50 PixelDrop als Login-Bonus. Spezielle Effekte und Animationen inklusive.',
        'landing.referral.desc': 'Lade Freunde ein und verdiene 5% ihrer Einnahmen. 2. Ebene: 1% zusätzlich.',
        'landing.pwa.desc': 'Installierbare Web-App für mobile Geräte. Funktioniert offline und wie eine native App.',
        'landing.steps.title': 'In 4 einfachen Schritten zu deinen ersten Kryptowährungen',
        'landing.step1.desc': 'Nutze die Karte um GeoDrops in deiner Nähe zu entdecken.',
        'landing.step2.desc': 'Mache ein Foto vom Standort und bestätige deine Anwesenheit.',
        'landing.referral.title': 'Verdiene mit jedem Freund, den du einlädst',
        'landing.ready.title': 'Bereit für die Zukunft des Geo-Minings?',
        
        // Registration
        'reg.username.placeholder': 'Wähle deinen Username',
        'reg.referral.placeholder': 'Referral-Code eingeben oder automatisch ausgefüllt',
        'reg.referral.bonus': 'Du erhältst 50 PixelDrop Bonus wenn du über einen Referral-Link kommst!',
        'reg.start.bonus': 'Du erhältst 100 PixelDrop Startbonus!',
        'reg.welcome.back': 'Willkommen zurück!',
        'reg.fill.fields': 'Bitte fülle alle Felder aus!',
        'reg.success': 'Registrierung erfolgreich! Du erhältst 50 PixelDrop Startbonus!',
        'reg.invalid.email': 'Ungültige E-Mail',
        'reg.network.error': 'Netzwerkfehler. Bitte Internetverbindung prüfen',
        'reg.too.many.attempts': 'Zu viele Versuche. Bitte später erneut versuchen',
        'reg.invalid.credentials': 'Ungültige Anmeldedaten',
        
        // Dashboard
        'dashboard.today.activity': 'Heutige Aktivität',
        'dashboard.available.pixeldrop.app': 'Verfügbare PixelDrop (App):',
        'dashboard.available.pixeldrop.blockchain': 'Verfügbare PixelDrop (Blockchain):',
        'dashboard.wallet.address': 'Wallet-Adresse für Auszahlung:',
        'dashboard.emergency.loaded': 'Dashboard wurde notfallmäßig geladen.',
        'dashboard.not.available': 'Nicht verfügbar',
        'dashboard.insufficient.pixeldrop': 'Nicht genügend PixelDrop',
        'dashboard.invalid.wallet': 'Ungültige Wallet-Adresse!',
        'dashboard.payout.unavailable': 'Auszahlungsfunktion nicht verfügbar! Bitte Seite neu laden.',
        'dashboard.transaction.confirming': 'Transaktion wird bestätigt...',
        'dashboard.insufficient.bnb': 'Nicht genügend BNB für Gas-Gebühren.',
        'dashboard.pool.insufficient': 'Pool hat nicht genügend',
        'dashboard.firebase.unavailable': 'Firebase oder Benutzer nicht verfügbar',
        
        // Whitepaper & Roadmap
        'whitepaper.show.full': 'Vollständige Whitepaper anzeigen',
        'whitepaper.trading.system': 'Vollständiges DeFi-Trading zwischen PixelDrop ↔ tBNB',
        'whitepaper.gps': 'Präzise Standortbestimmung mit 20m Genauigkeit',
        'whitepaper.firebase': 'Echtzeitdatenbank für Drops und User-Interaktionen',
        'whitepaper.bonus.system': 'Tägliche Belohnungen mit Special Effects',
        'whitepaper.pwa.support': 'Installierbare Web-App für mobile Geräte',
        'whitepaper.real.time': 'Live-Updates für alle App-Funktionen',
        'whitepaper.encrypted': 'Verschlüsselte Datenübertragung',
        'whitepaper.basic.functionality': 'Grundlegende GeoDrop-Funktionalität',
        'whitepaper.tbnb.integration': 'Vollständige tBNB Integration',
        'whitepaper.nft.integration': 'NFT Integration für GeoDrops',
        'whitepaper.ar.vr': 'AR/VR-Integration für immersive Erlebnisse',
        'whitepaper.daily.bonus': 'Täglicher Bonus',
        'whitepaper.daily.pixeldrops': '50 PixelDrops täglich',
        'whitepaper.trading.rewards': 'Belohnungen für aktives Trading',
        'whitepaper.better.performance': 'Für bessere Performance',
        
        // Dev System
        'dev.access.active': 'Dev-Zugang aktiv - Klicken zum Öffnen',
        'dev.tab.clicked': 'Dev-Tab geklickt - öffne Dev-Seite',
        'dev.button.clicked': 'Dev-Button geklickt - öffne Dev-Seite',
        
        // GeoCard Messages
        'geocard.reload.success': 'Alle Listen wurden neu geladen',
        'geocard.reload.error': 'Fehler beim Neuladen der Listen',
        'geocard.dev.access.required': 'Dev-Zugang erforderlich!',
        'geocard.username.not.found': 'Username nicht gefunden! Bitte Profil vervollständigen.',
        'geocard.drop.created': 'Drop erstellt',
        'geocard.check.user.drops.error': 'Fehler beim Überprüfen der User Drop Anzahl',
        'geocard.cleanup.confirm': 'Duplikate bereinigen?\n\nDies löscht alle doppelten User Drops und behält nur die neuesten.',
        'geocard.tracking.added': 'User-Drop-Tracking wurde zu Firebase hinzugefügt!',
        'geocard.dev.drops.selected': 'Dev Drops für Upload ausgewählt',
        'geocard.user.drops.selected': 'User Drops für Upload ausgewählt',
        
        // Mining Messages
        'mining.package.expires': 'Verfällt in 7 Tagen',
        'mining.transaction.sent': 'Transaktion gesendet! Warte auf Bestätigung...',
        'mining.metamask.step1': 'Öffne die MetaMask App auf deinem Handy',
        
        // Bonus Messages
        'bonus.daily.rewards': 'Tägliche Belohnungen',
        'bonus.login.daily': 'Logge dich täglich ein und erhalte Bonus-Coins!',
        'bonus.available': 'Bonus verfügbar!',
        'bonus.can.claim': 'Du kannst heute noch deinen Bonus abholen!',
        'bonus.claim': 'Bonus abholen (50 PixelDrops)',
        'bonus.test.system': 'Test System',
        'bonus.force.show': 'Force Show Button',
        'bonus.debug.elements': 'Debug Elements',
        'bonus.already.claimed': 'Bonus bereits abgeholt',
        'bonus.come.tomorrow': 'Komm morgen wieder und hol dir deinen neuen Bonus!',
        'bonus.next.reset': 'Nächster Reset in:',
        'bonus.history': 'Bonus-Verlauf',
        'bonus.loading.history': 'Lade Bonus-Verlauf...',
        'bonus.referral.system': 'Referral-System',
        'bonus.your.referral': 'Dein Referral-Link',
        'bonus.referral.loading': 'Referral-Link wird geladen...',
        'bonus.copy': 'Kopieren',
        'bonus.share.earn': 'Teile diesen Link mit Freunden und verdiene 10% von deren ersten Einkäufen!',
        'bonus.referral.stats': 'Referral-Statistiken',
        'bonus.direct.refs': 'Direkte Refs',
        'bonus.earned.pd': 'Verdient (PD)',
        'bonus.special.effects': 'Special Effects',
        'bonus.streak.bonus': 'Streak Bonus',
        'bonus.streak.percent': '+10% pro Tag',
        'bonus.speed.bonus': 'Speed Bonus',
        'bonus.speed.reward': 'Schnelle Belohnung',
        'bonus.premium.bonus': 'Premium Bonus',
        'bonus.premium.rewards': 'Exklusive Belohnungen',
        
        // GeoCard Additional Messages
        'geocard.current.position.inserted': 'Aktuelle Position eingefügt',
        'geocard.current.position.unavailable': 'Aktuelle Position nicht verfügbar',
        'geocard.enter.valid.coordinates': 'Bitte gib gültige Koordinaten ein!',
        'geocard.invalid.coordinates': 'Ungültige Koordinaten!',
        'geocard.dev.geodrop.select': 'Dev GeoDrop auswählen...',
        'geocard.user.geodrop.select': 'User GeoDrop auswählen...',
        'geocard.collected.today': 'Heute gesammelt',
        'geocard.available': 'Verfügbar',
        
        // Austrian States and Places (for reference)
        'austria.carinthia': 'Kärnten',
        'austria.lower.austria': 'Niederösterreich',
        'austria.upper.austria': 'Oberösterreich',
        'austria.vienna': 'Wien',
        'place.schloss.schoenbrunn': 'Schloss Schönbrunn',
        'place.minimundus.klagenfurt': 'Minimundus Klagenfurt',
        'place.linz.hauptplatz': 'Linz Hauptplatz',
        'place.stift.melk': 'Stift Melk',
        'place.burg.forchtenstein': 'Burg Forchtenstein',
        'place.schloss.esterhazy': 'Schloss Esterházy Eisenstadt',
        'place.seebuehne.moerbisch': 'Seebühne Mörbisch',
        'place.weinmuseum.moschendorf': 'Weinmuseum Moschendorf',
        'place.naturpark.geschriebenstein': 'Naturpark Geschriebenstein',
        'place.schloss.halbturn': 'Schloss Halbturn',
        'place.st.martins.therme': 'St. Martins Therme',
        
        // Photo Descriptions
        'photo.stift.melk.desc': 'Fotografiere das Stift Melk mit seiner barocken Architektur und dem prächtigen Kloster. Das Stift sollte vollständig sichtbar sein.',
        'photo.burg.forchtenstein.desc': 'Fotografiere die imposante Burg Forchtenstein mit ihren charakteristischen Türmen und der mittelalterlichen Architektur. Die Burg sollte vollständig im Bild sichtbar sein.',
        'photo.schloss.esterhazy.desc': 'Fotografiere das prächtige Schloss Esterházy mit seiner barocken Fassade und den schönen Gärten. Das Hauptgebäude sollte gut erkennbar sein.',
        'photo.seebuehne.moerbisch.desc': 'Fotografiere die berühmte Seebühne Mörbisch am Neusiedler See. Die Bühne sollte mit dem Wasser im Hintergrund sichtbar sein.',
        'photo.weinmuseum.moschendorf.desc': 'Fotografiere das Weinmuseum Moschendorf mit seinem charakteristischen Gebäude. Das Museum sollte gut erkennbar sein.',
        'photo.naturpark.geschriebenstein.desc': 'Fotografiere die Landschaft des Naturparks Geschriebenstein mit seinen charakteristischen Hügeln und der Natur. Die typische Landschaft sollte erkennbar sein.',
        'photo.schloss.halbturn.desc': 'Fotografiere das barocke Schloss Halbturn mit seiner prächtigen Architektur und den Gärten. Das Schloss sollte als Hauptmotiv sichtbar sein.',
        'photo.st.martins.therme.desc': 'Fotografiere die St. Martins Therme mit ihrem modernen Gebäude und den Thermalbecken. Die Therme sollte gut erkennbar sein.',
        
        // Dashboard Messages
        'dashboard.today.activity': 'Heutige Aktivität',
        'dashboard.available.pixeldrop.app': 'Verfügbare PixelDrop (App):',
        'dashboard.available.pixeldrop.blockchain': 'Verfügbare PixelDrop (Blockchain):',
        'dashboard.wallet.address': 'Wallet-Adresse für Auszahlung:',
        'dashboard.insufficient.pixeldrop': 'Nicht genügend PixelDrop',
        'dashboard.invalid.wallet': 'Ungültige Wallet-Adresse!',
        'dashboard.demo.mode': 'Demo-Modus: Echte Auszahlungen sind nur in der lokalen Version verfügbar.\n\nFür echte Auszahlungen verwende die lokale Version mit Private Keys.',
        'dashboard.transaction.confirming': 'Transaktion wird bestätigt...',
        'dashboard.insufficient.bnb': 'Nicht genügend BNB für Gas-Gebühren.',
        'dashboard.pool.insufficient': 'Pool hat nicht genügend',
        'dashboard.firebase.unavailable': 'Firebase oder Benutzer nicht verfügbar',
        'dashboard.all.withdrawal.fields': 'Alle Auszahlungsfelder vorhanden!',
        'dashboard.missing.withdrawal.fields': 'Fehlende Auszahlungsfelder gefunden:',
        'dashboard.user.not.available': 'Benutzer nicht verfügbar. Führe checkUserStatus() aus.',
        'dashboard.withdrawal.data.deleted': 'Auszahlungsdaten gelöscht!',
        'dashboard.error.deleting': 'Fehler beim Löschen:',
        'dashboard.invalid.wallet.format': 'Ungültige Wallet-Adresse! Muss mit 0x beginnen und 42 Zeichen lang sein.',
        'dashboard.withdrawal.unavailable': 'Auszahlungsfunktion nicht verfügbar. Bitte verwende das Dashboard.',
        'dashboard.not.available': 'Nicht verfügbar',
        
        // Bonus Messages
        'bonus.weekly.already.claimed': 'Wöchentlicher Bonus bereits diese Woche abgeholt!',
        'bonus.weekly.error': 'Fehler beim Abholen des wöchentlichen Bonus!',
        'bonus.should.be.available': 'Bonus sollte verfügbar sein.',
        'bonus.should.be.claimed': 'Bonus sollte bereits geclaimt sein.',
        'bonus.referral.reset': 'Referral-Code auf Standard zurückgesetzt!',
        'bonus.firebase.unavailable': 'Firebase nicht verfügbar',
        'bonus.referral.users.added': 'Erfolgreich User zu Referral-Linien hinzugefügt!',
        'bonus.referral.error': 'Fehler beim Hinzufügen der User zu Referral-Linien:',
        'bonus.referral.bonus.added': 'Referral-Bonus von 50 Coins wurde zu deinem Account hinzugefügt!',
        'bonus.referral.code.error': 'Fehler beim Hinzufügen des Referral-Codes',
        
        // Common
        'common.save': 'Speichern',
        'common.cancel': 'Abbrechen',
        'common.loading': 'Lädt...',
        'common.error': 'Fehler',
        'common.success': 'Erfolgreich',
        'common.confirm': 'Bestätigen',
        'common.delete': 'Löschen',
        'common.edit': 'Bearbeiten',
        'common.close': 'Schließen',
        
        // Dev
        'dev.login.title': 'Dev-Zugang',
        'dev.login.password': 'Dev-Passwort eingeben',
        'dev.login.login': 'Anmelden',
        'dev.login.cancel': 'Abbrechen',
        'dev.login.tip': 'Nur für Entwickler mit entsprechenden Berechtigungen'
    },
    
    en: {
        // Navigation
        'nav.start': 'Start',
        'nav.geocard': 'GeoCard',
        'nav.geoboard': 'GeoBoard',
        'nav.mining': 'Mining',
        'nav.bonus': 'Bonus',
        'nav.geochat': 'GeoChat',
        'nav.trading': 'Trading',
        'nav.mehr': 'More',
        
        // Settings
        'settings.title': 'Settings',
        'settings.username': 'Username',
        'settings.username.placeholder': 'Username',
        'settings.username.save': 'Save',
        'settings.username.tip': 'The username replaces your email address in the game',
        'settings.email.title': 'Email Settings',
        'settings.email.current': 'Current Email:',
        'settings.email.new': 'New Email:',
        'settings.email.password': 'Confirm Password:',
        'settings.email.update': 'Update Email',
        'settings.notifications.title': 'Notifications',
        'settings.notifications.email': 'Email Notifications',
        'settings.notifications.push': 'Push Notifications',
        'settings.notifications.daily': 'Daily Updates',
        'settings.notifications.save': 'Save Settings',
        'settings.language.title': 'Language',
        'settings.language.german': 'Deutsch',
        'settings.language.english': 'English',
        'settings.language.save': 'Save Language',
        'settings.language.tip': 'The language will be changed after saving',
        
        // Mehr Tabs
        'mehr.dashboard': 'Dashboard',
        'mehr.profile': 'Profile',
        'mehr.settings': 'Settings',
        'mehr.stats': 'Statistics',
        'mehr.leitfaden': 'Guide',
        'mehr.impressum': 'Imprint',
        
        // Messages
        'message.username.required': 'Please enter username!',
        'message.username.saved': 'Username saved!',
        'message.notifications.saved': 'Notification settings saved!',
        'message.language.changed': 'Language changed to German',
        'message.language.changed.en': 'Language changed to English',
        'message.language.select': 'Please select a language!',
        'message.language.save.error': 'Error saving language!',
        'message.language.system.error': 'Language system not available!',
        
        // Page Content
        'page.welcome': 'Welcome to the Future of Geo-Mining',
        'page.user.info': 'User Info',
        'page.user.email': 'Email:',
        'page.user.username': 'Username:',
        'page.user.level': 'Level:',
        'page.user.coins': 'Coins:',
        'page.user.drops': 'Drops:',
        'page.user.boost': 'Boost:',
        
        // Landing Page
        'landing.learn.more': 'Learn more about the GeoDrop concept and the technology behind it.',
        'landing.daily.bonus': 'Daily Bonus',
        'landing.referral.percent': '+5% from purchases',
        'landing.discover.features': 'Discover the revolutionary features of the Geo-Mining App',
        'landing.geocaching.desc': 'Find virtual drops at real locations and earn cryptocurrencies through geocaching activities.',
        'landing.mining.desc': '4 different machine types for passive income. From Basic to Mega Miner with different boosts.',
        'landing.trading.desc': 'Trade PixelDrop ↔ tBNB directly in the app. Complete DeFi trading with Smart Contracts.',
        'landing.daily.bonuses': 'Daily Bonuses',
        'landing.daily.bonus.desc': 'Collect 50 PixelDrop daily as login bonus. Special effects and animations included.',
        'landing.referral.desc': 'Invite friends and earn 5% of their income. 2nd level: 1% additional.',
        'landing.pwa.desc': 'Installable web app for mobile devices. Works offline and like a native app.',
        'landing.steps.title': 'In 4 simple steps to your first cryptocurrencies',
        'landing.step1.desc': 'Use the map to discover GeoDrops near you.',
        'landing.step2.desc': 'Take a photo of the location and confirm your presence.',
        'landing.referral.title': 'Earn with every friend you invite',
        'landing.ready.title': 'Ready for the future of Geo-Mining?',
        
        // Registration
        'reg.username.placeholder': 'Choose your username',
        'reg.referral.placeholder': 'Enter referral code or auto-filled',
        'reg.referral.bonus': 'You get 50 PixelDrop bonus when you come via a referral link!',
        'reg.start.bonus': 'You get 100 PixelDrop start bonus!',
        'reg.welcome.back': 'Welcome back!',
        'reg.fill.fields': 'Please fill in all fields!',
        'reg.success': 'Registration successful! You get 50 PixelDrop start bonus!',
        'reg.invalid.email': 'Invalid email',
        'reg.network.error': 'Network error. Please check internet connection',
        'reg.too.many.attempts': 'Too many attempts. Please try again later',
        'reg.invalid.credentials': 'Invalid login credentials',
        
        // Dashboard
        'dashboard.today.activity': 'Today\'s Activity',
        'dashboard.available.pixeldrop.app': 'Available PixelDrop (App):',
        'dashboard.available.pixeldrop.blockchain': 'Available PixelDrop (Blockchain):',
        'dashboard.wallet.address': 'Wallet address for payout:',
        'dashboard.emergency.loaded': 'Dashboard was loaded in emergency mode.',
        'dashboard.not.available': 'Not available',
        'dashboard.insufficient.pixeldrop': 'Insufficient PixelDrop',
        'dashboard.invalid.wallet': 'Invalid wallet address!',
        'dashboard.payout.unavailable': 'Payout function not available! Please reload page.',
        'dashboard.transaction.confirming': 'Transaction is being confirmed...',
        'dashboard.insufficient.bnb': 'Insufficient BNB for gas fees.',
        'dashboard.pool.insufficient': 'Pool has insufficient',
        'dashboard.firebase.unavailable': 'Firebase or user not available',
        
        // Whitepaper & Roadmap
        'whitepaper.show.full': 'Show full whitepaper',
        'whitepaper.trading.system': 'Complete DeFi trading between PixelDrop ↔ tBNB',
        'whitepaper.gps': 'Precise location determination with 20m accuracy',
        'whitepaper.firebase': 'Real-time database for drops and user interactions',
        'whitepaper.bonus.system': 'Daily rewards with special effects',
        'whitepaper.pwa.support': 'Installable web app for mobile devices',
        'whitepaper.real.time': 'Live updates for all app functions',
        'whitepaper.encrypted': 'Encrypted data transmission',
        'whitepaper.basic.functionality': 'Basic GeoDrop functionality',
        'whitepaper.tbnb.integration': 'Complete tBNB integration',
        'whitepaper.nft.integration': 'NFT integration for GeoDrops',
        'whitepaper.ar.vr': 'AR/VR integration for immersive experiences',
        'whitepaper.daily.bonus': 'Daily Bonus',
        'whitepaper.daily.pixeldrops': '50 PixelDrops daily',
        'whitepaper.trading.rewards': 'Rewards for active trading',
        'whitepaper.better.performance': 'For better performance',
        
        // Dev System
        'dev.access.active': 'Dev access active - Click to open',
        'dev.tab.clicked': 'Dev tab clicked - open dev page',
        'dev.button.clicked': 'Dev button clicked - open dev page',
        
        // GeoCard Messages
        'geocard.reload.success': 'All lists have been reloaded',
        'geocard.reload.error': 'Error reloading lists',
        'geocard.dev.access.required': 'Dev access required!',
        'geocard.username.not.found': 'Username not found! Please complete profile.',
        'geocard.drop.created': 'Drop created',
        'geocard.check.user.drops.error': 'Error checking user drop count',
        'geocard.cleanup.confirm': 'Clean up duplicates?\n\nThis deletes all duplicate user drops and keeps only the newest ones.',
        'geocard.tracking.added': 'User drop tracking has been added to Firebase!',
        'geocard.dev.drops.selected': 'Dev drops selected for upload',
        'geocard.user.drops.selected': 'User drops selected for upload',
        
        // Mining Messages
        'mining.package.expires': 'Expires in 7 days',
        'mining.transaction.sent': 'Transaction sent! Waiting for confirmation...',
        'mining.metamask.step1': 'Open the MetaMask app on your phone',
        
        // Bonus Messages
        'bonus.daily.rewards': 'Daily Rewards',
        'bonus.login.daily': 'Log in daily and receive bonus coins!',
        'bonus.available': 'Bonus available!',
        'bonus.can.claim': 'You can still claim your bonus today!',
        'bonus.claim': 'Claim Bonus (50 PixelDrops)',
        'bonus.test.system': 'Test System',
        'bonus.force.show': 'Force Show Button',
        'bonus.debug.elements': 'Debug Elements',
        'bonus.already.claimed': 'Bonus already claimed',
        'bonus.come.tomorrow': 'Come back tomorrow and get your new bonus!',
        'bonus.next.reset': 'Next reset in:',
        'bonus.history': 'Bonus History',
        'bonus.loading.history': 'Loading bonus history...',
        'bonus.referral.system': 'Referral System',
        'bonus.your.referral': 'Your Referral Link',
        'bonus.referral.loading': 'Referral link is loading...',
        'bonus.copy': 'Copy',
        'bonus.share.earn': 'Share this link with friends and earn 10% of their first purchases!',
        'bonus.referral.stats': 'Referral Statistics',
        'bonus.direct.refs': 'Direct Refs',
        'bonus.earned.pd': 'Earned (PD)',
        'bonus.special.effects': 'Special Effects',
        'bonus.streak.bonus': 'Streak Bonus',
        'bonus.streak.percent': '+10% per day',
        'bonus.speed.bonus': 'Speed Bonus',
        'bonus.speed.reward': 'Quick reward',
        'bonus.premium.bonus': 'Premium Bonus',
        'bonus.premium.rewards': 'Exclusive rewards',
        
        // GeoCard Additional Messages
        'geocard.current.position.inserted': 'Current position inserted',
        'geocard.current.position.unavailable': 'Current position not available',
        'geocard.enter.valid.coordinates': 'Please enter valid coordinates!',
        'geocard.invalid.coordinates': 'Invalid coordinates!',
        'geocard.dev.geodrop.select': 'Select Dev GeoDrop...',
        'geocard.user.geodrop.select': 'Select User GeoDrop...',
        'geocard.collected.today': 'Collected today',
        'geocard.available': 'Available',
        
        // Austrian States and Places (for reference)
        'austria.carinthia': 'Carinthia',
        'austria.lower.austria': 'Lower Austria',
        'austria.upper.austria': 'Upper Austria',
        'austria.vienna': 'Vienna',
        'place.schloss.schoenbrunn': 'Schönbrunn Palace',
        'place.minimundus.klagenfurt': 'Minimundus Klagenfurt',
        'place.linz.hauptplatz': 'Linz Main Square',
        'place.stift.melk': 'Melk Abbey',
        'place.burg.forchtenstein': 'Forchtenstein Castle',
        'place.schloss.esterhazy': 'Esterházy Palace Eisenstadt',
        'place.seebuehne.moerbisch': 'Mörbisch Lake Stage',
        'place.weinmuseum.moschendorf': 'Moschendorf Wine Museum',
        'place.naturpark.geschriebenstein': 'Geschriebenstein Nature Park',
        'place.schloss.halbturn': 'Halbturn Palace',
        'place.st.martins.therme': 'St. Martins Spa',
        
        // Photo Descriptions
        'photo.stift.melk.desc': 'Photograph Melk Abbey with its baroque architecture and magnificent monastery. The abbey should be fully visible.',
        'photo.burg.forchtenstein.desc': 'Photograph the imposing Forchtenstein Castle with its characteristic towers and medieval architecture. The castle should be fully visible in the image.',
        'photo.schloss.esterhazy.desc': 'Photograph the magnificent Esterházy Palace with its baroque facade and beautiful gardens. The main building should be clearly recognizable.',
        'photo.seebuehne.moerbisch.desc': 'Photograph the famous Mörbisch Lake Stage on Lake Neusiedl. The stage should be visible with the water in the background.',
        'photo.weinmuseum.moschendorf.desc': 'Photograph the Moschendorf Wine Museum with its characteristic building. The museum should be clearly recognizable.',
        'photo.naturpark.geschriebenstein.desc': 'Photograph the landscape of Geschriebenstein Nature Park with its characteristic hills and nature. The typical landscape should be recognizable.',
        'photo.schloss.halbturn.desc': 'Photograph the baroque Halbturn Palace with its magnificent architecture and gardens. The palace should be visible as the main subject.',
        'photo.st.martins.therme.desc': 'Photograph St. Martins Spa with its modern building and thermal pools. The spa should be clearly recognizable.',
        
        // Dashboard Messages
        'dashboard.today.activity': 'Today\'s Activity',
        'dashboard.available.pixeldrop.app': 'Available PixelDrop (App):',
        'dashboard.available.pixeldrop.blockchain': 'Available PixelDrop (Blockchain):',
        'dashboard.wallet.address': 'Wallet address for payout:',
        'dashboard.insufficient.pixeldrop': 'Insufficient PixelDrop',
        'dashboard.invalid.wallet': 'Invalid wallet address!',
        'dashboard.demo.mode': 'Demo mode: Real payouts are only available in the local version.\n\nFor real payouts use the local version with private keys.',
        'dashboard.transaction.confirming': 'Transaction is being confirmed...',
        'dashboard.insufficient.bnb': 'Insufficient BNB for gas fees.',
        'dashboard.pool.insufficient': 'Pool has insufficient',
        'dashboard.firebase.unavailable': 'Firebase or user not available',
        'dashboard.all.withdrawal.fields': 'All withdrawal fields present!',
        'dashboard.missing.withdrawal.fields': 'Missing withdrawal fields found:',
        'dashboard.user.not.available': 'User not available. Run checkUserStatus().',
        'dashboard.withdrawal.data.deleted': 'Withdrawal data deleted!',
        'dashboard.error.deleting': 'Error deleting:',
        'dashboard.invalid.wallet.format': 'Invalid wallet address! Must start with 0x and be 42 characters long.',
        'dashboard.withdrawal.unavailable': 'Withdrawal function not available. Please use the dashboard.',
        'dashboard.not.available': 'Not available',
        
        // Bonus Messages
        'bonus.weekly.already.claimed': 'Weekly bonus already claimed this week!',
        'bonus.weekly.error': 'Error claiming weekly bonus!',
        'bonus.should.be.available': 'Bonus should be available.',
        'bonus.should.be.claimed': 'Bonus should already be claimed.',
        'bonus.referral.reset': 'Referral code reset to default!',
        'bonus.firebase.unavailable': 'Firebase not available',
        'bonus.referral.users.added': 'Successfully added users to referral lines!',
        'bonus.referral.error': 'Error adding users to referral lines:',
        'bonus.referral.bonus.added': 'Referral bonus of 50 coins has been added to your account!',
        'bonus.referral.code.error': 'Error adding referral code',
        
        // Common
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
        'common.confirm': 'Confirm',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.close': 'Close',
        
        // Dev
        'dev.login.title': 'Dev Access',
        'dev.login.password': 'Enter dev password',
        'dev.login.login': 'Login',
        'dev.login.cancel': 'Cancel',
        'dev.login.tip': 'Only for developers with appropriate permissions'
    }
};

// Language System Class
class LanguageSystem {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'de';
        this.init();
    }
    
    init() {
        console.log('🌍 Language system initialized with:', this.currentLanguage);
        this.updateConfig();
        this.applyLanguage();
    }
    
    getStoredLanguage() {
        return localStorage.getItem('geodrop_language') || 'de';
    }
    
    setLanguage(lang) {
        if (!LANGUAGES[lang]) {
            console.error('❌ Unsupported language:', lang);
            return false;
        }
        
        this.currentLanguage = lang;
        localStorage.setItem('geodrop_language', lang);
        this.updateConfig();
        this.applyLanguage();
        
        console.log('🌍 Language changed to:', lang);
        return true;
    }
    
    updateConfig() {
        // Update global config if available
        if (window.CONFIG && window.CONFIG.ui) {
            window.CONFIG.ui.language = this.currentLanguage;
        }
    }
    
    getText(key) {
        const translation = LANGUAGES[this.currentLanguage][key];
        if (!translation) {
            console.warn('⚠️ Translation missing for key:', key, 'in language:', this.currentLanguage);
            return key; // Return key as fallback
        }
        return translation;
    }
    
    applyLanguage() {
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
        
        // Update page title
        const title = document.querySelector('title');
        if (title) {
            if (this.currentLanguage === 'en') {
                title.textContent = 'Settings - GeoDrop';
            } else {
                title.textContent = 'Einstellungen - GeoDrop';
            }
        }
        
        // Apply translations to elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getText(key);
            
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else if (element.tagName === 'INPUT' && element.type === 'password') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // Update specific elements by ID
        this.updateSpecificElements();
    }
    
    updateSpecificElements() {
        // Navigation elements
        const navElements = {
            'nav-start': 'nav.start',
            'nav-geocard': 'nav.geocard',
            'nav-geoboard': 'nav.geoboard',
            'nav-mining': 'nav.mining',
            'nav-bonus': 'nav.bonus',
            'nav-geochat': 'nav.geochat',
            'nav-trading': 'nav.trading',
            'nav-mehr': 'nav.mehr'
        };
        
        Object.entries(navElements).forEach(([id, key]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.getText(key);
            }
        });
        
        // Settings elements
        const settingsElements = {
            'settings-title': 'settings.title',
            'settings-username-label': 'settings.username',
            'settings-username-label-text': 'settings.username',
            'settings-username': 'settings.username.placeholder',
            'settings-username-save': 'settings.username.save',
            'settings-username-tip': 'settings.username.tip',
            'settings-email-title': 'settings.email.title',
            'settings-email-current': 'settings.email.current',
            'settings-email-new': 'settings.email.new',
            'settings-email-password': 'settings.email.password',
            'settings-email-update': 'settings.email.update',
            'settings-notifications-title': 'settings.notifications.title',
            'settings-notifications-email': 'settings.notifications.email',
            'settings-notifications-push': 'settings.notifications.push',
            'settings-notifications-daily': 'settings.notifications.daily',
            'settings-notifications-save': 'settings.notifications.save',
            'settings-language-title': 'settings.language.title',
            'settings-language-german': 'settings.language.german',
            'settings-language-english': 'settings.language.english',
            'settings-language-save': 'settings.language.save',
            'settings-language-tip': 'settings.language.tip'
        };
        
        // Mehr tab elements
        const mehrElements = {
            'mehr-dashboard-tab': 'mehr.dashboard',
            'mehr-profile-tab': 'mehr.profile',
            'mehr-settings-tab': 'mehr.settings',
            'mehr-stats-tab': 'mehr.stats',
            'mehr-leitfaden-tab': 'mehr.leitfaden',
            'mehr-impressum-tab': 'mehr.impressum'
        };
        
        Object.entries(settingsElements).forEach(([id, key]) => {
            const element = document.getElementById(id);
            if (element) {
                if (element.tagName === 'INPUT') {
                    element.placeholder = this.getText(key);
                } else {
                    element.textContent = this.getText(key);
                }
            }
        });
        
        Object.entries(mehrElements).forEach(([id, key]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.getText(key);
            }
        });
        
        // Page elements
        const pageElements = {
            'page-welcome': 'page.welcome',
            'page-user-info': 'page.user.info',
            'page-user-email': 'page.user.email',
            'page-user-username': 'page.user.username',
            'page-user-level': 'page.user.level',
            'page-user-coins': 'page.user.coins',
            'page-user-drops': 'page.user.drops',
            'page-user-boost': 'page.user.boost'
        };
        
        Object.entries(pageElements).forEach(([id, key]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.getText(key);
            }
        });
        
        // Landing page elements
        const landingElements = {
            'landing-learn-more': 'landing.learn.more',
            'landing-daily-bonus': 'landing.daily.bonus',
            'landing-referral-percent': 'landing.referral.percent',
            'landing-discover-features': 'landing.discover.features',
            'landing-geocaching-desc': 'landing.geocaching.desc',
            'landing-mining-desc': 'landing.mining.desc',
            'landing-trading-desc': 'landing.trading.desc',
            'landing-daily-bonuses': 'landing.daily.bonuses',
            'landing-daily-bonus-desc': 'landing.daily.bonus.desc',
            'landing-referral-desc': 'landing.referral.desc',
            'landing-pwa-desc': 'landing.pwa.desc',
            'landing-steps-title': 'landing.steps.title',
            'landing-step1-desc': 'landing.step1.desc',
            'landing-step2-desc': 'landing.step2.desc',
            'landing-referral-title': 'landing.referral.title',
            'landing-ready-title': 'landing.ready.title'
        };
        
        Object.entries(landingElements).forEach(([id, key]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.getText(key);
            }
        });
        
        // Registration elements
        const regElements = {
            'reg-username': 'reg.username.placeholder',
            'reg-referral': 'reg.referral.placeholder',
            'reg-referral-bonus': 'reg.referral.bonus',
            'reg-start-bonus': 'reg.start.bonus',
            'form-subtitle': 'reg.welcome.back'
        };
        
        Object.entries(regElements).forEach(([id, key]) => {
            const element = document.getElementById(id);
            if (element) {
                if (element.tagName === 'INPUT') {
                    element.placeholder = this.getText(key);
                } else {
                    element.textContent = this.getText(key);
                }
            }
        });
        
        // Dashboard elements
        const dashboardElements = {
            'dashboard-today-activity': 'dashboard.today.activity',
            'dashboard-available-pixeldrop-app': 'dashboard.available.pixeldrop.app',
            'dashboard-available-pixeldrop-blockchain': 'dashboard.available.pixeldrop.blockchain',
            'dashboard-wallet-address': 'dashboard.wallet.address',
            'dashboard-emergency-loaded': 'dashboard.emergency.loaded'
        };
        
        Object.entries(dashboardElements).forEach(([id, key]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.getText(key);
            }
        });
        
        // Whitepaper elements
        const whitepaperElements = {
            'whitepaper-show-full': 'whitepaper.show.full',
            'whitepaper-trading-system': 'whitepaper.trading.system',
            'whitepaper-gps': 'whitepaper.gps',
            'whitepaper-firebase': 'whitepaper.firebase',
            'whitepaper-bonus-system': 'whitepaper.bonus.system',
            'whitepaper-pwa-support': 'whitepaper.pwa.support',
            'whitepaper-real-time': 'whitepaper.real.time',
            'whitepaper-encrypted': 'whitepaper.encrypted',
            'whitepaper-basic-functionality': 'whitepaper.basic.functionality',
            'whitepaper-tbnb-integration': 'whitepaper.tbnb.integration',
            'whitepaper-nft-integration': 'whitepaper.nft.integration',
            'whitepaper-ar-vr': 'whitepaper.ar.vr',
            'whitepaper-daily-bonus': 'whitepaper.daily.bonus',
            'whitepaper-daily-pixeldrops': 'whitepaper.daily.pixeldrops',
            'whitepaper-trading-rewards': 'whitepaper.trading.rewards',
            'whitepaper-better-performance': 'whitepaper.better.performance'
        };
        
        Object.entries(whitepaperElements).forEach(([id, key]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.getText(key);
            }
        });
        
        // Mining elements
        const miningElements = {
            'mining-metamask-step1': 'mining.metamask.step1'
        };
        
        Object.entries(miningElements).forEach(([id, key]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.getText(key);
            }
        });
        
        // Bonus elements
        const bonusElements = {
            'bonus-daily-rewards': 'bonus.daily.rewards',
            'bonus-login-daily': 'bonus.login.daily',
            'bonus-available-text': 'bonus.available',
            'bonus-can-claim': 'bonus.can.claim',
            'bonus-claim': 'bonus.claim',
            'bonus-test-system': 'bonus.test.system',
            'bonus-force-show': 'bonus.force.show',
            'bonus-debug-elements': 'bonus.debug.elements',
            'bonus-already-claimed': 'bonus.already.claimed',
            'bonus-come-tomorrow': 'bonus.come.tomorrow',
            'bonus-next-reset': 'bonus.next.reset',
            'bonus-history': 'bonus.history',
            'bonus-loading-history': 'bonus.loading.history',
            'bonus-referral-system': 'bonus.referral.system',
            'bonus-your-referral': 'bonus.your.referral',
            'bonus-referral-loading': 'bonus.referral.loading',
            'bonus-copy': 'bonus.copy',
            'bonus-share-earn': 'bonus.share.earn',
            'bonus-referral-stats': 'bonus.referral.stats',
            'bonus-direct-refs': 'bonus.direct.refs',
            'bonus-earned-pd': 'bonus.earned.pd',
            'bonus-special-effects': 'bonus.special.effects',
            'bonus-streak-bonus': 'bonus.streak.bonus',
            'bonus-streak-percent': 'bonus.streak.percent',
            'bonus-speed-bonus': 'bonus.speed.bonus',
            'bonus-speed-reward': 'bonus.speed.reward',
            'bonus-premium-bonus': 'bonus.premium.bonus',
            'bonus-premium-rewards': 'bonus.premium.rewards'
        };
        
        Object.entries(bonusElements).forEach(([id, key]) => {
            const element = document.getElementById(id);
            if (element) {
                if (element.tagName === 'INPUT') {
                    element.placeholder = this.getText(key);
                } else {
                    element.textContent = this.getText(key);
                }
            }
        });
        
        // Dashboard elements
        const dashboardElements = {
            'dashboard-today-activity': 'dashboard.today.activity',
            'dashboard-available-pixeldrop-app': 'dashboard.available.pixeldrop.app',
            'dashboard-available-pixeldrop-blockchain': 'dashboard.available.pixeldrop.blockchain',
            'dashboard-wallet-address': 'dashboard.wallet.address'
        };
        
        Object.entries(dashboardElements).forEach(([id, key]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.getText(key);
            }
        });
    }
    
    // Utility function to get translated text
    t(key) {
        return this.getText(key);
    }
    
    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    // Check if current language is German
    isGerman() {
        return this.currentLanguage === 'de';
    }
    
    // Check if current language is English
    isEnglish() {
        return this.currentLanguage === 'en';
    }
}

// Initialize language system
window.languageSystem = new LanguageSystem();

// Global translation function
window.t = function(key) {
    return window.languageSystem.t(key);
};

// Language switching function
window.switchLanguage = function(lang) {
    const success = window.languageSystem.setLanguage(lang);
    if (success) {
        // Show success message
        const message = lang === 'en' ? 
            window.languageSystem.t('message.language.changed.en') : 
            window.languageSystem.t('message.language.changed');
        
        if (typeof showMessage === 'function') {
            showMessage('✅ ' + message, false);
        } else {
            alert('✅ ' + message);
        }
        
        // Reload settings page to apply all translations
        if (window.location.pathname.includes('settings.html')) {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
};

console.log('🌍 Language system loaded successfully');
