// Language Management System for GeoDrop
// Sprachverwaltungssystem für GeoDrop

// Language translations / Sprachübersetzungen
const translations = {
    de: {
        // Navigation
        'navigation.start': 'Start',
        'navigation.geocard': 'GeoCard',
        'navigation.geoboard': 'GeoBoard',
        'navigation.mining': 'Mining',
        'navigation.bonus': 'Bonus',
        'navigation.geochat': 'GeoChat',
        'navigation.trading': 'Trading',
        'navigation.mehr': 'Mehr',
        'navigation.dev': 'Dev',
        'navigation.dashboard': '🏠 Dashboard',
        'navigation.profile': '👤 Profil',
        'navigation.settings': '⚙️ Einstellungen',
        'navigation.stats': '📊 Statistiken',
        'navigation.guide': '📖 Leitfaden',
        'navigation.impressum': 'ℹ️ Impressum',
        
        // Leitfaden Content
        'leitfaden.title': '📚 KryptoGuru',
        'leitfaden.subtitle': '📚 KryptoGuru - Dein Leitfaden',
        'leitfaden.welcome': 'Willkommen beim KryptoGuru! Hier findest du alle wichtigen Informationen über GeoDrop und Kryptowährungen.',
        
        // Mobile Navigation
        'mobile.start': 'Start',
        'mobile.geocard': 'GeoCard',
        'mobile.board': 'Board',
        'mobile.mining': 'Mining',
        'mobile.bonus': 'Bonus',
        'mobile.trading': 'Trading',
        'mobile.chat': 'Chat',
        'mobile.mehr': 'Mehr',
        
        // Main Content
        'main.welcome': 'Willkommen bei der Zukunft des Geo-Minings',
        'main.userinfo': '👤 Benutzerinfo',
        'main.logout': 'Abmelden',
        'main.whitepaper': '📄 Whitepaper',
        'main.whitepaper.read': '📄 Whitepaper lesen',
        'main.referral.bonus': '🎉 Referral Bonus!',
        'main.referral.text': 'Du erhältst 50 PixelDrop Startbonus!',
        'main.start.bonus': 'Du erhältst 100 PixelDrop Startbonus!',
        'main.register.free': 'Registriere dich kostenlos und erhalte sofort 100 PixelDrop Startbonus!',
        'main.ready.future': 'Bereit für die Zukunft des Geo-Minings?',
        'main.learn.more': 'Mehr erfahren',
        
        // Features
        'features.title': 'Entdecke die revolutionären Features der Geo-Mining App',
        'features.gps.mining': 'GPS-basiertes Mining',
        'features.gps.text': 'Sammle PixelDrop basierend auf deiner GPS-Position. Je mehr du dich bewegst, desto mehr verdienst du!',
        'features.mining.machines': 'Mining Machines',
        'features.mining.text': 'Kaufe und betreibe verschiedene Mining-Maschinen für automatische PixelDrop-Generierung.',
        'features.defi.trading': 'DeFi Trading',
        'features.defi.text': 'Handel PixelDrop ↔ tBNB direkt in der App. Vollständiges DeFi-Trading mit Smart Contracts.',
        'features.daily.bonus': 'Täglicher Bonus',
        'features.daily.text': 'Sammle täglich 50 PixelDrop als Login-Bonus. Spezielle Effekte und Animationen inklusive.',
        
        // Dev
        'dev.login.title': '🔐 Dev-Zugang',
        'dev.login.password': 'Dev-Passwort eingeben',
        'dev.login.button': 'Anmelden',
        'dev.login.cancel': 'Abbrechen',
        'dev.login.tip': '💡 Nur für Entwickler mit entsprechenden Berechtigungen',
        
        // Whitepaper
        'whitepaper.title': '📄 GeoDrop Whitepaper',
        'whitepaper.full': '📖 Vollständige Whitepaper anzeigen',
        'whitepaper.main': '📄 Haupt-Whitepaper',
        'whitepaper.alt': '📄 Alternative Whitepaper',
        'whitepaper.tip': '💡 Klicke auf die Buttons um die vollständigen Whitepaper-Dokumente in neuen Tabs zu öffnen',
        'whitepaper.mobile': '📱 Mobile Nutzer: Die Whitepaper öffnen sich in neuen Browser-Tabs.',
        
        // Forms
        'form.welcome.back': 'Willkommen zurück!',
        'form.register.success': '✅ Registrierung erfolgreich! Willkommen bei GeoDrop!',
        
        // Dashboard
        'dashboard.title': '🏠 Dashboard',
        'dashboard.your-stats': '📊 Deine Statistiken',
        'dashboard.pixeldrop-balance': 'PixelDrop Balance:',
        'dashboard.tbnb-balance': 'tBNB Balance:',
        'dashboard.geodrops-collected': 'GeoDrops gesammelt:',
        'dashboard.mining-boost': 'Mining Boost:',
        'dashboard.today-activity': '🎯 Heutige Aktivität',
        'dashboard.geodrops-today': 'GeoDrops heute:',
        'dashboard.pixeldrop-earned': 'PixelDrop verdient:',
        'dashboard.mining-time': 'Mining Zeit:',
        'dashboard.pixeldrop-payout': '💸 PixelDrop Auszahlung',
        'dashboard.available-app': 'Verfügbare PixelDrop (App):',
        'dashboard.available-blockchain': 'Verfügbare PixelDrop (Blockchain):',
        'dashboard.payout': 'Auszahlung:',
        'dashboard.real-blockchain': 'Echte Blockchain-Transaktion',
        'dashboard.wallet-address': 'Wallet-Adresse für Auszahlung:',
        'dashboard.amount-to-withdraw': 'Auszuzahlende PixelDrop:',
        'dashboard.max': 'Max',
        'dashboard.amount-to-pay': 'Auszuzahlender Betrag:',
        'dashboard.calculate': '💰 Berechnen',
        'dashboard.withdraw': '💸 Auszahlen',
        'dashboard.min-withdrawal': '💡 Mindestauszahlung: 100 PixelDrop',
        
        // Settings
        'settings.title': '⚙️ Einstellungen',
        'settings.username': '👤 Benutzername',
        'settings.username-label': 'Benutzername:',
        'settings.save': '💾 Speichern',
        'settings.username-tip': '💡 Tipp: Der Benutzername ersetzt deine E-Mail-Adresse im Spiel',
        'settings.email-settings': '📧 E-Mail Einstellungen',
        'settings.current-email': 'Aktuelle E-Mail:',
        'settings.new-email': 'Neue E-Mail:',
        'settings.confirm-password': 'Passwort bestätigen:',
        'settings.update-email': '📧 E-Mail aktualisieren',
        'settings.notifications': '🔔 Benachrichtigungen',
        'settings.email-notifications': 'E-Mail Benachrichtigungen',
        'settings.push-notifications': 'Push Benachrichtigungen',
        'settings.daily-updates': 'Tägliche Updates',
        'settings.save-settings': '💾 Einstellungen speichern',
        'settings.language': '🌍 Sprache',
        'settings.language-german': '🇩🇪 Deutsch',
        'settings.language-english': '🇺🇸 English',
        'settings.language-tip': '💡 Tipp: Die Sprache wird sofort geändert und gespeichert',
        
        // Profile
        'profile.title': '👤 Profil',
        'profile.username': 'Benutzername:',
        'profile.email': 'E-Mail:',
        'profile.user-id': 'Benutzer-ID:',
        'profile.registration': 'Registrierung:',
        'profile.coins': 'PixelDrop:',
        'profile.drops': 'GeoDrops:',
        'profile.today-drops': 'Heute GeoDrops:',
        'profile.today-coins': 'Heute PixelDrop:',
        'profile.mining-boost': 'Mining Boost:',
        'profile.referral-code': 'Empfehlungscode:',
        
        // Stats
        'stats.title': '📊 Statistiken',
        'stats.total-drops': 'Gesamte GeoDrops:',
        'stats.total-earnings': 'Gesamte Einnahmen:',
        'stats.user-level': 'Benutzer Level:',
        'stats.mining-machines': 'Mining Maschinen:',
        'stats.bonus-claimed': 'Bonus erhalten:',
        'stats.current-balance': 'Aktuelle Balance:',
        'stats.first-login': 'Erste Anmeldung:',
        'stats.last-activity': 'Letzte Aktivität:',
        'stats.total-referrals': 'Gesamte Empfehlungen:',
        'stats.today-drops': 'Heute GeoDrops:',
        'stats.today-earnings': 'Heute Einnahmen:',
        
        // Common
        'common.loading': 'Lädt...',
        'common.error': 'Fehler',
        'common.success': 'Erfolgreich',
        'common.cancel': 'Abbrechen',
        'common.ok': 'OK',
        'common.yes': 'Ja',
        'common.no': 'Nein',
        'common.save': 'Speichern',
        'common.delete': 'Löschen',
        'common.edit': 'Bearbeiten',
        'common.close': 'Schließen',
        'common.not-available': 'Nicht verfügbar'
    },
    
    en: {
        // Navigation
        'navigation.start': 'Start',
        'navigation.geocard': 'GeoCard',
        'navigation.geoboard': 'GeoBoard',
        'navigation.mining': 'Mining',
        'navigation.bonus': 'Bonus',
        'navigation.geochat': 'GeoChat',
        'navigation.trading': 'Trading',
        'navigation.mehr': 'More',
        'navigation.dev': 'Dev',
        'navigation.dashboard': '🏠 Dashboard',
        'navigation.profile': '👤 Profile',
        'navigation.settings': '⚙️ Settings',
        'navigation.stats': '📊 Statistics',
        'navigation.guide': '📖 Guide',
        'navigation.impressum': 'ℹ️ Legal',
        
        // Leitfaden Content (KryptoGuru bleibt unverändert)
        'leitfaden.title': '📚 KryptoGuru',
        'leitfaden.subtitle': '📚 KryptoGuru - Your Guide',
        'leitfaden.welcome': 'Welcome to KryptoGuru! Here you will find all important information about GeoDrop and cryptocurrencies.',
        
        // Mobile Navigation
        'mobile.start': 'Start',
        'mobile.geocard': 'GeoCard',
        'mobile.board': 'Board',
        'mobile.mining': 'Mining',
        'mobile.bonus': 'Bonus',
        'mobile.trading': 'Trading',
        'mobile.chat': 'Chat',
        'mobile.mehr': 'More',
        
        // Main Content
        'main.welcome': 'Welcome to the Future of Geo-Mining',
        'main.userinfo': '👤 User Info',
        'main.logout': 'Logout',
        'main.whitepaper': '📄 Whitepaper',
        'main.whitepaper.read': '📄 Read Whitepaper',
        'main.referral.bonus': '🎉 Referral Bonus!',
        'main.referral.text': 'You receive 50 PixelDrop start bonus!',
        'main.start.bonus': 'You receive 100 PixelDrop start bonus!',
        'main.register.free': 'Register for free and receive 100 PixelDrop start bonus immediately!',
        'main.ready.future': 'Ready for the Future of Geo-Mining?',
        'main.learn.more': 'Learn More',
        
        // Features
        'features.title': 'Discover the revolutionary features of the Geo-Mining App',
        'features.gps.mining': 'GPS-based Mining',
        'features.gps.text': 'Collect PixelDrop based on your GPS position. The more you move, the more you earn!',
        'features.mining.machines': 'Mining Machines',
        'features.mining.text': 'Buy and operate various mining machines for automatic PixelDrop generation.',
        'features.defi.trading': 'DeFi Trading',
        'features.defi.text': 'Trade PixelDrop ↔ tBNB directly in the app. Full DeFi trading with smart contracts.',
        'features.daily.bonus': 'Daily Bonus',
        'features.daily.text': 'Collect 50 PixelDrop daily as login bonus. Special effects and animations included.',
        
        // Dev
        'dev.login.title': '🔐 Dev Access',
        'dev.login.password': 'Enter Dev Password',
        'dev.login.button': 'Login',
        'dev.login.cancel': 'Cancel',
        'dev.login.tip': '💡 Only for developers with appropriate permissions',
        
        // Whitepaper
        'whitepaper.title': '📄 GeoDrop Whitepaper',
        'whitepaper.full': '📖 Show Full Whitepaper',
        'whitepaper.main': '📄 Main Whitepaper',
        'whitepaper.alt': '📄 Alternative Whitepaper',
        'whitepaper.tip': '💡 Click the buttons to open the full whitepaper documents in new tabs',
        'whitepaper.mobile': '📱 Mobile Users: The whitepapers will open in new browser tabs.',
        
        // Forms
        'form.welcome.back': 'Welcome back!',
        'form.register.success': '✅ Registration successful! Welcome to GeoDrop!',
        
        // Dashboard
        'dashboard.title': '🏠 Dashboard',
        'dashboard.your-stats': '📊 Your Statistics',
        'dashboard.pixeldrop-balance': 'PixelDrop Balance:',
        'dashboard.tbnb-balance': 'tBNB Balance:',
        'dashboard.geodrops-collected': 'GeoDrops Collected:',
        'dashboard.mining-boost': 'Mining Boost:',
        'dashboard.today-activity': '🎯 Today\'s Activity',
        'dashboard.geodrops-today': 'GeoDrops Today:',
        'dashboard.pixeldrop-earned': 'PixelDrop Earned:',
        'dashboard.mining-time': 'Mining Time:',
        'dashboard.pixeldrop-payout': '💸 PixelDrop Withdrawal',
        'dashboard.available-app': 'Available PixelDrop (App):',
        'dashboard.available-blockchain': 'Available PixelDrop (Blockchain):',
        'dashboard.payout': 'Withdrawal:',
        'dashboard.real-blockchain': 'Real Blockchain Transaction',
        'dashboard.wallet-address': 'Wallet Address for Withdrawal:',
        'dashboard.amount-to-withdraw': 'PixelDrop to Withdraw:',
        'dashboard.max': 'Max',
        'dashboard.amount-to-pay': 'Amount to Withdraw:',
        'dashboard.calculate': '💰 Calculate',
        'dashboard.withdraw': '💸 Withdraw',
        'dashboard.min-withdrawal': '💡 Minimum withdrawal: 100 PixelDrop',
        
        // Settings
        'settings.title': '⚙️ Settings',
        'settings.username': '👤 Username',
        'settings.username-label': 'Username:',
        'settings.save': '💾 Save',
        'settings.username-tip': '💡 Tip: The username replaces your email address in the game',
        'settings.email-settings': '📧 Email Settings',
        'settings.current-email': 'Current Email:',
        'settings.new-email': 'New Email:',
        'settings.confirm-password': 'Confirm Password:',
        'settings.update-email': '📧 Update Email',
        'settings.notifications': '🔔 Notifications',
        'settings.email-notifications': 'Email Notifications',
        'settings.push-notifications': 'Push Notifications',
        'settings.daily-updates': 'Daily Updates',
        'settings.save-settings': '💾 Save Settings',
        'settings.language': '🌍 Language',
        'settings.language-german': '🇩🇪 Deutsch',
        'settings.language-english': '🇺🇸 English',
        'settings.language-tip': '💡 Tip: Language will be changed and saved immediately',
        
        // Profile
        'profile.title': '👤 Profile',
        'profile.username': 'Username:',
        'profile.email': 'Email:',
        'profile.user-id': 'User ID:',
        'profile.registration': 'Registration:',
        'profile.coins': 'PixelDrop:',
        'profile.drops': 'GeoDrops:',
        'profile.today-drops': 'Today GeoDrops:',
        'profile.today-coins': 'Today PixelDrop:',
        'profile.mining-boost': 'Mining Boost:',
        'profile.referral-code': 'Referral Code:',
        
        // Stats
        'stats.title': '📊 Statistics',
        'stats.total-drops': 'Total GeoDrops:',
        'stats.total-earnings': 'Total Earnings:',
        'stats.user-level': 'User Level:',
        'stats.mining-machines': 'Mining Machines:',
        'stats.bonus-claimed': 'Bonus Claimed:',
        'stats.current-balance': 'Current Balance:',
        'stats.first-login': 'First Login:',
        'stats.last-activity': 'Last Activity:',
        'stats.total-referrals': 'Total Referrals:',
        'stats.today-drops': 'Today GeoDrops:',
        'stats.today-earnings': 'Today Earnings:',
        
        // Common
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
        'common.cancel': 'Cancel',
        'common.ok': 'OK',
        'common.yes': 'Yes',
        'common.no': 'No',
        'common.save': 'Save',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.close': 'Close',
        'common.not-available': 'Not available'
    }
};

// Current language / Aktuelle Sprache
let currentLanguage = 'de';

// Initialize language system / Sprachsystem initialisieren
function initLanguageSystem() {
    console.log('🌍 Initializing language system...');
    
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('geodrop-language');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
        console.log('✅ Loaded saved language:', currentLanguage);
    } else {
        console.log('✅ Using default language:', currentLanguage);
    }
    
    // Update UI language
    updateLanguageDisplay();
    applyLanguage();
    
    console.log('✅ Language system initialized');
}

// Get translation for a key / Übersetzung für einen Schlüssel abrufen
function t(key) {
    const translation = translations[currentLanguage] && translations[currentLanguage][key];
    if (translation) {
        return translation;
    }
    
    // Fallback to German if English translation not found
    const fallback = translations['de'] && translations['de'][key];
    if (fallback) {
        console.warn(`⚠️ Translation missing for '${key}' in '${currentLanguage}', using German fallback`);
        return fallback;
    }
    
    // Return key if no translation found
    console.warn(`⚠️ Translation missing for '${key}' in both languages`);
    return key;
}

// Change language / Sprache ändern
window.changeLanguage = function() {
    console.log('🌍 Changing language...');
    
    const selector = document.getElementById('language-selector');
    if (!selector) {
        console.error('❌ Language selector not found');
        return;
    }
    
    const newLanguage = selector.value;
    if (!translations[newLanguage]) {
        console.error('❌ Invalid language:', newLanguage);
        return;
    }
    
    console.log('🔄 Changing from', currentLanguage, 'to', newLanguage);
    
    // Update current language
    currentLanguage = newLanguage;
    
    // Save to localStorage
    localStorage.setItem('geodrop-language', currentLanguage);
    console.log('💾 Language saved to localStorage:', currentLanguage);
    
    // Update UI
    updateLanguageDisplay();
    applyLanguage();
    
    // Show success message
    const message = currentLanguage === 'de' ? 
        '✅ Sprache erfolgreich geändert!' : 
        '✅ Language changed successfully!';
    
    if (typeof window.showMessage === 'function') {
        window.showMessage(message);
    } else {
        alert(message);
    }
    
    console.log('✅ Language changed to:', currentLanguage);
};

// Update language display in settings / Sprachanzeige in Einstellungen aktualisieren
function updateLanguageDisplay() {
    console.log('🔄 Updating language display...');
    
    // Update current language display
    const currentLangElement = document.getElementById('current-language');
    if (currentLangElement) {
        currentLangElement.textContent = currentLanguage === 'de' ? 'Deutsch' : 'English';
    }
    
    // Update language selector
    const selector = document.getElementById('language-selector');
    if (selector) {
        selector.value = currentLanguage;
    }
    
    // Update radio buttons in settings
    const langDe = document.getElementById('lang-de');
    const langEn = document.getElementById('lang-en');
    if (langDe && langEn) {
        langDe.checked = currentLanguage === 'de';
        langEn.checked = currentLanguage === 'en';
    }
    
    console.log('✅ Language display updated');
}

// Apply language to UI elements / Sprache auf UI-Elemente anwenden
function applyLanguage() {
    console.log('🌍 Applying language to UI elements...');
    
    // Apply translations to elements with data-lang attribute
    const elements = document.querySelectorAll('[data-lang]');
    let updatedCount = 0;
    
    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        const translation = t(key);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            if (element.type === 'button' || element.type === 'submit') {
                element.value = translation;
            } else {
                element.placeholder = translation;
            }
        } else {
            element.textContent = translation;
        }
        
        updatedCount++;
    });
    
    console.log(`✅ Applied language to ${updatedCount} elements`);
    
    // Update specific elements by their content (if they don't have data-lang)
    updateSpecificElements();
    
    // Update settings page elements
    updateSettingsElements();
    
    // Update main navigation elements
    updateMainNavigationElements();
    
    // Update mobile navigation elements
    updateMobileNavigationElements();
    
    // Update main content elements
    updateMainContentElements();
}

// Update specific elements that don't have data-lang attributes
function updateSpecificElements() {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.mehr-tab-btn');
    tabButtons.forEach(btn => {
        const tabId = btn.getAttribute('data-tab');
        if (tabId) {
            const key = `navigation.${tabId}`;
            const translation = t(key);
            // Only update the text, keep the emoji
            const currentText = btn.textContent || btn.innerText;
            const emoji = currentText.split(' ')[0]; // Get first part (emoji)
            btn.innerHTML = `${emoji} ${translation.split(' ').slice(1).join(' ')}`;
        }
    });
    
    // Update page titles when tabs are loaded
    updatePageTitles();
}

// Update page titles / Seitentitel aktualisieren
function updatePageTitles() {
    // Update dashboard title
    const dashboardTitle = document.querySelector('h3[class*="text-2xl"]');
    if (dashboardTitle && dashboardTitle.textContent.includes('Dashboard')) {
        dashboardTitle.textContent = t('dashboard.title');
    }
    
    // Update settings title
    const settingsTitle = document.querySelector('h3[class*="text-2xl"]');
    if (settingsTitle && settingsTitle.textContent.includes('Einstellungen')) {
        settingsTitle.textContent = t('settings.title');
    }
}

// Update settings page elements / Einstellungsseite-Elemente aktualisieren
function updateSettingsElements() {
    // Update settings title
    const settingsTitle = document.getElementById('settings-title');
    if (settingsTitle) {
        settingsTitle.textContent = t('settings.title');
    }
    
    // Update username section
    const usernameLabel = document.getElementById('settings-username-label');
    if (usernameLabel) {
        usernameLabel.textContent = t('settings.username');
    }
    
    const usernameLabelText = document.getElementById('settings-username-label-text');
    if (usernameLabelText) {
        usernameLabelText.textContent = t('settings.username-label');
    }
    
    const usernameSave = document.getElementById('settings-username-save');
    if (usernameSave) {
        usernameSave.textContent = t('settings.save');
    }
    
    const usernameTip = document.getElementById('settings-username-tip');
    if (usernameTip) {
        usernameTip.textContent = t('settings.username-tip');
    }
    
    // Update email section
    const emailTitle = document.getElementById('settings-email-title');
    if (emailTitle) {
        emailTitle.textContent = t('settings.email-settings');
    }
    
    const emailCurrent = document.getElementById('settings-email-current');
    if (emailCurrent) {
        emailCurrent.textContent = t('settings.current-email');
    }
    
    const emailNew = document.getElementById('settings-email-new');
    if (emailNew) {
        emailNew.textContent = t('settings.new-email');
    }
    
    const emailPassword = document.getElementById('settings-email-password');
    if (emailPassword) {
        emailPassword.textContent = t('settings.confirm-password');
    }
    
    const emailUpdate = document.getElementById('update-email-btn');
    if (emailUpdate) {
        emailUpdate.textContent = t('settings.update-email');
    }
    
    // Update notifications section
    const notificationsTitle = document.getElementById('settings-notifications-title');
    if (notificationsTitle) {
        notificationsTitle.textContent = t('settings.notifications');
    }
    
    const notificationsEmail = document.getElementById('settings-notifications-email');
    if (notificationsEmail) {
        notificationsEmail.textContent = t('settings.email-notifications');
    }
    
    const notificationsPush = document.getElementById('settings-notifications-push');
    if (notificationsPush) {
        notificationsPush.textContent = t('settings.push-notifications');
    }
    
    const notificationsDaily = document.getElementById('settings-notifications-daily');
    if (notificationsDaily) {
        notificationsDaily.textContent = t('settings.daily-updates');
    }
    
    const notificationsSave = document.getElementById('settings-notifications-save');
    if (notificationsSave) {
        notificationsSave.textContent = t('settings.save-settings');
    }
    
    // Update language section
    const languageTitle = document.getElementById('settings-language-title');
    if (languageTitle) {
        languageTitle.textContent = t('settings.language');
    }
    
    const languageGerman = document.getElementById('settings-language-german');
    if (languageGerman) {
        languageGerman.textContent = t('settings.language-german');
    }
    
    const languageEnglish = document.getElementById('settings-language-english');
    if (languageEnglish) {
        languageEnglish.textContent = t('settings.language-english');
    }
    
    const languageTip = document.getElementById('settings-language-tip');
    if (languageTip) {
        languageTip.textContent = t('settings.language-tip');
    }
    
    // Update leitfaden elements
    const leitfadenTitle = document.getElementById('leitfaden-title');
    if (leitfadenTitle) {
        leitfadenTitle.textContent = t('leitfaden.title');
    }
    
    const leitfadenSubtitle = document.getElementById('leitfaden-subtitle');
    if (leitfadenSubtitle) {
        leitfadenSubtitle.textContent = t('leitfaden.subtitle');
    }
    
    const leitfadenWelcome = document.getElementById('leitfaden-welcome');
    if (leitfadenWelcome) {
        leitfadenWelcome.textContent = t('leitfaden.welcome');
    }
}

// Get current language / Aktuelle Sprache abrufen
window.getCurrentLanguage = function() {
    return currentLanguage;
};

// Set language programmatically / Sprache programmatisch setzen
window.setLanguage = function(language) {
    if (!translations[language]) {
        console.error('❌ Invalid language:', language);
        return false;
    }
    
    console.log('🔄 Changing from', currentLanguage, 'to', language);
    
    currentLanguage = language;
    localStorage.setItem('geodrop-language', currentLanguage);
    updateLanguageDisplay();
    applyLanguage();
    
    // Show success message
    const message = currentLanguage === 'de' ? 
        '✅ Sprache erfolgreich geändert!' : 
        '✅ Language changed successfully!';
    
    if (typeof window.showMessage === 'function') {
        window.showMessage(message);
    } else {
        alert(message);
    }
    
    console.log('✅ Language set to:', currentLanguage);
    return true;
};

// Force refresh language / Sprache forciert aktualisieren
window.refreshLanguage = function() {
    console.log('🔄 Force refreshing language...');
    applyLanguage();
    updateLanguageDisplay();
    console.log('✅ Language refreshed');
};

// Auto-initialize on load / Auto-Initialisierung beim Laden
document.addEventListener('DOMContentLoaded', function() {
    initLanguageSystem();
});

// Also initialize immediately if DOM is already ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSystem);
} else {
    initLanguageSystem();
}

// Update main navigation elements / Hauptnavigation-Elemente aktualisieren
function updateMainNavigationElements() {
    // Update desktop navigation
    const navLinks = document.querySelectorAll('.desktop-nav .nav-btn');
    navLinks.forEach(link => {
        const text = link.textContent.trim();
        let translation = '';
        
        if (text.includes('Start')) translation = t('navigation.start');
        else if (text.includes('GeoCard')) translation = t('navigation.geocard');
        else if (text.includes('GeoBoard')) translation = t('navigation.geoboard');
        else if (text.includes('Mining')) translation = t('navigation.mining');
        else if (text.includes('Bonus')) translation = t('navigation.bonus');
        else if (text.includes('GeoChat')) translation = t('navigation.geochat');
        else if (text.includes('Trading')) translation = t('navigation.trading');
        else if (text.includes('Mehr')) translation = t('navigation.mehr');
        else if (text.includes('Dev')) translation = t('navigation.dev');
        
        if (translation) {
            const emoji = text.split(' ')[0]; // Keep emoji
            link.innerHTML = `<span class="mr-3">${emoji}</span> ${translation}`;
        }
    });
}

// Update mobile navigation elements / Mobile Navigation-Elemente aktualisieren
function updateMobileNavigationElements() {
    const mobileNavLabels = document.querySelectorAll('.mobile-nav .nav-label');
    mobileNavLabels.forEach(label => {
        const text = label.textContent.trim();
        let translation = '';
        
        if (text === 'Start') translation = t('mobile.start');
        else if (text === 'GeoCard') translation = t('mobile.geocard');
        else if (text === 'Board') translation = t('mobile.board');
        else if (text === 'Mining') translation = t('mobile.mining');
        else if (text === 'Bonus') translation = t('mobile.bonus');
        else if (text === 'Trading') translation = t('mobile.trading');
        else if (text === 'Chat') translation = t('mobile.chat');
        else if (text === 'Mehr') translation = t('mobile.mehr');
        
        if (translation) {
            label.textContent = translation;
        }
    });
}

// Update main content elements / Hauptinhalt-Elemente aktualisieren
function updateMainContentElements() {
    // Update welcome text
    const welcomeText = document.querySelector('p:contains("Willkommen bei der Zukunft")');
    if (welcomeText) {
        welcomeText.textContent = t('main.welcome');
    }
    
    // Update user info section
    const userInfoTitle = document.querySelector('h3:contains("Benutzerinfo")');
    if (userInfoTitle) {
        userInfoTitle.textContent = t('main.userinfo');
    }
    
    // Update logout button
    const logoutButton = document.querySelector('button:contains("Abmelden")');
    if (logoutButton) {
        logoutButton.textContent = t('main.logout');
    }
    
    // Update whitepaper section
    const whitepaperTitle = document.querySelector('h3:contains("Whitepaper")');
    if (whitepaperTitle) {
        whitepaperTitle.textContent = t('main.whitepaper');
    }
    
    const whitepaperButton = document.querySelector('button:contains("Whitepaper lesen")');
    if (whitepaperButton) {
        whitepaperButton.textContent = t('main.whitepaper.read');
    }
    
    // Update referral bonus text
    const referralBonus = document.querySelector('*:contains("Referral Bonus!")');
    if (referralBonus) {
        referralBonus.innerHTML = referralBonus.innerHTML.replace('Referral Bonus!', t('main.referral.bonus'));
    }
    
    // Update dev login popup
    const devLoginTitle = document.querySelector('h2:contains("Dev-Zugang")');
    if (devLoginTitle) {
        devLoginTitle.textContent = t('dev.login.title');
    }
    
    const devPasswordInput = document.getElementById('dev-password');
    if (devPasswordInput) {
        devPasswordInput.placeholder = t('dev.login.password');
    }
    
    const devLoginButton = document.querySelector('button:contains("Anmelden")');
    if (devLoginButton) {
        devLoginButton.textContent = t('dev.login.button');
    }
    
    const devCancelButton = document.querySelector('button:contains("Abbrechen")');
    if (devCancelButton) {
        devCancelButton.textContent = t('dev.login.cancel');
    }
}

// Expose for global access / Für globalen Zugriff bereitstellen
window.t = t;
window.initLanguageSystem = initLanguageSystem;
window.applyLanguage = applyLanguage;
window.updateLanguageDisplay = updateLanguageDisplay;
window.updateSettingsElements = updateSettingsElements;
window.updateMainNavigationElements = updateMainNavigationElements;
window.updateMobileNavigationElements = updateMobileNavigationElements;
window.updateMainContentElements = updateMainContentElements;

console.log('✅ Language system loaded');
