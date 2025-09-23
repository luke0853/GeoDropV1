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
        'navigation.dashboard': '🏠 Dashboard',
        'navigation.profile': '👤 Profil',
        'navigation.settings': '⚙️ Einstellungen',
        'navigation.stats': '📊 Statistiken',
        'navigation.guide': '📖 Leitfaden',
        'navigation.impressum': 'ℹ️ Impressum',
        'navigation.tokenomics': '💰 Tokenomics',
        'navigation.dev': '🔧 Dev',
        
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
        'settings.language': '🌍 Sprache / Language',
        'settings.current-language': 'Aktuelle Sprache / Current Language:',
        'settings.select-language': 'Sprache wählen / Select Language:',
        'settings.change-language': '🌍 Sprache ändern / Change Language',
        'settings.language-tip': '💡 Die Sprache wird sofort geändert und gespeichert / Language will be changed and saved immediately',
        'settings.language-status': '✅ Spracheinstellung gespeichert / Language setting saved',
        'settings.language-preview': '🔍 Sprachvorschau / Language Preview',
        'settings.language-info': 'ℹ️ Sprachinformationen / Language Information',
        'settings.language-test': '🧪 Sprachtest / Language Test',
        'settings.language-reset': '🔄 Zurücksetzen / Reset',
        'settings.language-info-text': '• Deutsch: Vollständige Übersetzung aller App-Bereiche\n• English: Complete translation of all app sections\n• Automatische Speicherung: Spracheinstellung wird in localStorage gespeichert\n• Auto-save: Language setting is saved in localStorage',
        
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
        
        // Startseite
        'startseite.title': 'GeoDrop',
        'startseite.subtitle': 'Willkommen bei der Zukunft des Geo-Minings',
        'startseite.login': '🔑 Anmeldung',
        'startseite.email': 'E-Mail',
        'startseite.password': 'Passwort',
        'startseite.login-btn': 'Anmelden',
        'startseite.register-btn': 'Registrieren',
        'startseite.forgot-password': 'Passwort vergessen?',
        'startseite.referral-code': '🔗 REFERRAL-CODE (OPTIONAL)',
        'startseite.referral-placeholder': 'REFERRAL-CODE EINGEBEN',
        'startseite.referral-tip': 'Du erhältst 50 PixelDrop Bonus wenn du über einen Referral-Link kommst!',
        'startseite.login-tip': '💡 Tipp: Drücke Enter in den Eingabefeldern zum schnellen Anmelden',
        'startseite.user-info': '👤 Benutzerinfo',
        'startseite.username': 'Benutzername',
        'startseite.email': 'E-Mail',
        'startseite.level': 'Level',
        'startseite.pixeldrop': 'PixelDrop',
        'startseite.tbnb': 'tBNB',
        'startseite.drops': 'Drops',
        'startseite.boost': 'Boost',
        'startseite.logout': 'Abmelden',
        'startseite.whitepaper': '📖 Vollständiges Whitepaper',
        'startseite.roadmap': '🗺️ Roadmap anzeigen',
        'startseite.whitepaper-tip': '💡 Klicke auf "Vollständiges Whitepaper" für die detaillierte Version mit aktueller Roadmap',
        
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
        'common.not-available': 'Nicht verfügbar',
        'common.language-changed': '✅ Sprache erfolgreich geändert!'
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
        'navigation.dashboard': '🏠 Dashboard',
        'navigation.profile': '👤 Profile',
        'navigation.settings': '⚙️ Settings',
        'navigation.stats': '📊 Statistics',
        'navigation.guide': '📖 Guide',
        'navigation.impressum': 'ℹ️ Legal',
        'navigation.tokenomics': '💰 Tokenomics',
        'navigation.dev': '🔧 Dev',
        
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
        'settings.language': '🌍 Sprache / Language',
        'settings.current-language': 'Aktuelle Sprache / Current Language:',
        'settings.select-language': 'Sprache wählen / Select Language:',
        'settings.change-language': '🌍 Sprache ändern / Change Language',
        'settings.language-tip': '💡 Die Sprache wird sofort geändert und gespeichert / Language will be changed and saved immediately',
        'settings.language-status': '✅ Language setting saved / Spracheinstellung gespeichert',
        'settings.language-preview': '🔍 Language Preview / Sprachvorschau',
        'settings.language-info': 'ℹ️ Language Information / Sprachinformationen',
        'settings.language-test': '🧪 Language Test / Sprachtest',
        'settings.language-reset': '🔄 Reset / Zurücksetzen',
        'settings.language-info-text': '• English: Complete translation of all app sections\n• Deutsch: Vollständige Übersetzung aller App-Bereiche\n• Auto-save: Language setting is saved in localStorage\n• Automatische Speicherung: Spracheinstellung wird in localStorage gespeichert',
        
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
        
        // Startseite
        'startseite.title': 'GeoDrop',
        'startseite.subtitle': 'Welcome to the Future of Geo-Mining',
        'startseite.login': '🔑 Login',
        'startseite.email': 'Email',
        'startseite.password': 'Password',
        'startseite.login-btn': 'Login',
        'startseite.register-btn': 'Register',
        'startseite.forgot-password': 'Forgot Password?',
        'startseite.referral-code': '🔗 REFERRAL CODE (OPTIONAL)',
        'startseite.referral-placeholder': 'ENTER REFERRAL CODE',
        'startseite.referral-tip': 'You get 50 PixelDrop bonus if you come through a referral link!',
        'startseite.login-tip': '💡 Tip: Press Enter in the input fields for quick login',
        'startseite.user-info': '👤 User Info',
        'startseite.username': 'Username',
        'startseite.email': 'Email',
        'startseite.level': 'Level',
        'startseite.pixeldrop': 'PixelDrop',
        'startseite.tbnb': 'tBNB',
        'startseite.drops': 'Drops',
        'startseite.boost': 'Boost',
        'startseite.logout': 'Logout',
        'startseite.whitepaper': '📖 Full Whitepaper',
        'startseite.roadmap': '🗺️ Show Roadmap',
        'startseite.whitepaper-tip': '💡 Click on "Full Whitepaper" for the detailed version with current roadmap',
        
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
        'common.not-available': 'Not available',
        'common.language-changed': '✅ Language changed successfully!'
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
    
    // Ensure startseite button and radio buttons are updated after a short delay
    setTimeout(() => {
        updateLanguageDisplay();
        updateStartseiteButton();
        updateRadioButtons();
        console.log('🔄 Language elements updated after delay');
    }, 100);
    
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

// Switch language (for settings page) / Sprache wechseln (für Einstellungsseite)
window.switchLanguage = function(language) {
    console.log('🌍 Switching language to:', language);
    
    if (!translations[language]) {
        console.error('❌ Invalid language:', language);
        return;
    }
    
    // Update current language
    currentLanguage = language;
    
    // Save to localStorage
    localStorage.setItem('geodrop-language', currentLanguage);
    console.log('💾 Language saved to localStorage:', currentLanguage);
    
    // Update UI
    updateLanguageDisplay();
    applyLanguage();
    
    // Update startseite button specifically
    updateStartseiteButton();
    
    // Update radio buttons specifically
    updateRadioButtons();
    
    // Also try to update radio buttons after a delay (in case they're loaded dynamically)
    setTimeout(() => {
        updateRadioButtons();
        console.log('🔄 Radio buttons updated after delay');
    }, 500);
    
    // Show success message
    const message = t('common.language-changed');
    if (typeof window.showMessage === 'function') {
        window.showMessage(message);
    } else {
        alert(message);
    }
    
    console.log('✅ Language switched to:', currentLanguage);
};

// Toggle language (for startseite button) / Sprache umschalten (für Startseite-Button)
window.toggleLanguage = function() {
    console.log('🌍 Toggling language from', currentLanguage, 'to', currentLanguage === 'de' ? 'en' : 'de');
    
    const newLanguage = currentLanguage === 'de' ? 'en' : 'de';
    
    // Update current language
    currentLanguage = newLanguage;
    
    // Save to localStorage
    localStorage.setItem('geodrop-language', currentLanguage);
    console.log('💾 Language saved to localStorage:', currentLanguage);
    
    // Update UI immediately
    updateLanguageDisplay();
    applyLanguage();
    updateStartseiteButton();
    updateRadioButtons();
    
    // Also try to update radio buttons after a delay (in case they're loaded dynamically)
    setTimeout(() => {
        updateRadioButtons();
        console.log('🔄 Radio buttons updated after toggle delay');
    }, 500);
    
    console.log('✅ Language toggled to:', currentLanguage);
};

// Test language switch function / Sprachtest-Funktion
window.testLanguageSwitch = function() {
    console.log('🧪 Testing language switch...');
    
    const currentLang = window.getCurrentLanguage();
    const testLang = currentLang === 'de' ? 'en' : 'de';
    
    // Temporarily switch language
    const originalLang = currentLanguage;
    currentLanguage = testLang;
    
    // Update preview
    updateLanguagePreview();
    
    // Show test message
    const message = currentLang === 'de' ? 
        `🧪 Sprachtest: Temporär zu ${testLang === 'en' ? 'Englisch' : 'Deutsch'} gewechselt. Klicke erneut um zurückzuwechseln.` :
        `🧪 Language Test: Temporarily switched to ${testLang === 'en' ? 'English' : 'German'}. Click again to switch back.`;
    
    alert(message);
    
    // Switch back after 3 seconds
    setTimeout(() => {
        currentLanguage = originalLang;
        updateLanguageDisplay();
        applyLanguage();
        updateLanguagePreview();
        console.log('🔄 Language test completed, switched back to:', originalLang);
    }, 3000);
};

// Reset language settings / Spracheinstellungen zurücksetzen
window.resetLanguageSettings = function() {
    console.log('🔄 Resetting language settings...');
    
    const confirmMessage = currentLanguage === 'de' ? 
        'Möchtest du die Spracheinstellungen zurücksetzen? Die Sprache wird auf Deutsch gesetzt.' :
        'Do you want to reset the language settings? The language will be set to German.';
    
    if (confirm(confirmMessage)) {
        // Reset to German
        currentLanguage = 'de';
        localStorage.setItem('geodrop-language', 'de');
        
        // Update UI
        updateLanguageDisplay();
        applyLanguage();
        updateLanguagePreview();
        
        const successMessage = '✅ Spracheinstellungen zurückgesetzt / Language settings reset';
        alert(successMessage);
        
        console.log('✅ Language settings reset to German');
    }
};

// Update language preview / Sprachvorschau aktualisieren
function updateLanguagePreview() {
    console.log('🔄 Updating language preview...');
    
    const currentLang = window.getCurrentLanguage();
    const isGerman = currentLang === 'de';
    
    // Update preview elements
    const previewTitle = document.getElementById('settings-language-preview-title');
    const previewLabel1 = document.getElementById('preview-label-1');
    const previewText1 = document.getElementById('preview-text-1');
    const previewLabel2 = document.getElementById('preview-label-2');
    const previewText2 = document.getElementById('preview-text-2');
    const previewLabel3 = document.getElementById('preview-label-3');
    const previewText3 = document.getElementById('preview-text-3');
    
    if (previewTitle) previewTitle.textContent = t('settings.language-preview');
    
    if (isGerman) {
        if (previewLabel1) previewLabel1.textContent = 'Einstellungen:';
        if (previewText1) previewText1.textContent = 'Settings';
        if (previewLabel2) previewLabel2.textContent = 'Benutzername:';
        if (previewText2) previewText2.textContent = 'Username';
        if (previewLabel3) previewLabel3.textContent = 'Benachrichtigungen:';
        if (previewText3) previewText3.textContent = 'Notifications';
    } else {
        if (previewLabel1) previewLabel1.textContent = 'Settings:';
        if (previewText1) previewText1.textContent = 'Einstellungen';
        if (previewLabel2) previewLabel2.textContent = 'Username:';
        if (previewText2) previewText2.textContent = 'Benutzername';
        if (previewLabel3) previewLabel3.textContent = 'Notifications:';
        if (previewText3) previewText3.textContent = 'Benachrichtigungen';
    }
    
    console.log('✅ Language preview updated');
}

// Update language display in settings / Sprachanzeige in Einstellungen aktualisieren
function updateLanguageDisplay() {
    console.log('🔄 Updating language display...');
    
    // Update current language display in settings
    const currentLangElement = document.getElementById('settings-current-language-display');
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
        // Force uncheck both first
        langDe.checked = false;
        langEn.checked = false;
        // Then set the correct one
        if (currentLanguage === 'de') {
            langDe.checked = true;
        } else if (currentLanguage === 'en') {
            langEn.checked = true;
        }
        console.log('🔄 Radio buttons updated:', { de: langDe.checked, en: langEn.checked, current: currentLanguage });
    } else {
        console.log('⚠️ Radio buttons not found');
    }
    
    // Update startseite language button
    const languageFlag = document.getElementById('language-flag');
    const languageText = document.getElementById('language-text');
    if (languageFlag && languageText) {
        languageFlag.textContent = currentLanguage === 'de' ? '🇩🇪' : '🇺🇸';
        languageText.textContent = currentLanguage === 'de' ? 'DE' : 'EN';
        console.log('🔄 Startseite button updated:', currentLanguage === 'de' ? '🇩🇪 DE' : '🇺🇸 EN');
    } else {
        console.log('⚠️ Startseite button elements not found');
    }
    
    // Update language status
    const languageStatus = document.getElementById('settings-language-status');
    if (languageStatus) {
        languageStatus.textContent = t('settings.language-status');
    }
    
    // Update language info
    const languageInfo = document.getElementById('settings-language-info');
    if (languageInfo) {
        languageInfo.innerHTML = t('settings.language-info-text').replace(/\n/g, '<br>');
    }
    
    // Update language info title
    const languageInfoTitle = document.getElementById('settings-language-info-title');
    if (languageInfoTitle) {
        languageInfoTitle.textContent = t('settings.language-info');
    }
    
    // Update test and reset buttons
    const testBtn = document.getElementById('settings-language-test');
    const resetBtn = document.getElementById('settings-language-reset');
    if (testBtn) testBtn.textContent = t('settings.language-test');
    if (resetBtn) resetBtn.textContent = t('settings.language-reset');
    
    // Update language preview
    updateLanguagePreview();
    
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
    
    // Update startseite elements
    updateStartseiteElements();
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

// Update startseite elements / Startseite-Elemente aktualisieren
function updateStartseiteElements() {
    console.log('🔄 Updating startseite elements...');
    
    // Update title and subtitle
    const title = document.getElementById('startseite-title');
    const subtitle = document.getElementById('startseite-subtitle');
    if (title) title.textContent = t('startseite.title');
    if (subtitle) subtitle.textContent = t('startseite.subtitle');
    
    // Update login section
    const loginSection = document.querySelector('#login-section h3');
    if (loginSection) loginSection.textContent = t('startseite.login');
    
    // Update input placeholders
    const emailInput = document.getElementById('startseite-auth-email');
    const passwordInput = document.getElementById('startseite-auth-password');
    if (emailInput) emailInput.placeholder = t('startseite.email');
    if (passwordInput) passwordInput.placeholder = t('startseite.password');
    
    // Update buttons
    const loginBtn = document.querySelector('button[onclick="login()"]');
    const registerBtn = document.querySelector('button[onclick="register()"]');
    const forgotBtn = document.querySelector('button[onclick="resetPassword()"]');
    if (loginBtn) loginBtn.textContent = t('startseite.login-btn');
    if (registerBtn) registerBtn.textContent = t('startseite.register-btn');
    if (forgotBtn) forgotBtn.textContent = t('startseite.forgot-password');
    
    // Update referral section
    const referralLabel = document.querySelector('label[for="reg-referral"]');
    const referralInput = document.getElementById('reg-referral');
    const referralTip = document.querySelector('#reg-referral + p');
    if (referralLabel) referralLabel.textContent = t('startseite.referral-code');
    if (referralInput) referralInput.placeholder = t('startseite.referral-placeholder');
    if (referralTip) referralTip.textContent = t('startseite.referral-tip');
    
    // Update login tip
    const loginTip = document.querySelector('.text-xs.text-gray-400.mt-2');
    if (loginTip) loginTip.textContent = t('startseite.login-tip');
    
    // Update user info section
    const userInfoTitle = document.getElementById('user-info-title');
    if (userInfoTitle) userInfoTitle.textContent = t('startseite.user-info');
    
    // Update user info labels
    const emailLabel = document.getElementById('user-email-label');
    const usernameLabel = document.getElementById('user-username-label');
    const levelLabel = document.getElementById('user-level-label');
    const coinsLabel = document.getElementById('user-coins-label');
    const dropsLabel = document.getElementById('user-drops-label');
    const boostLabel = document.getElementById('user-boost-label');
    const logoutBtn = document.querySelector('button[onclick="logout()"]');
    
    if (emailLabel) emailLabel.textContent = t('startseite.email');
    if (usernameLabel) usernameLabel.textContent = t('startseite.username');
    if (levelLabel) levelLabel.textContent = t('startseite.level');
    if (coinsLabel) coinsLabel.textContent = t('startseite.pixeldrop');
    if (dropsLabel) dropsLabel.textContent = t('startseite.drops');
    if (boostLabel) boostLabel.textContent = t('startseite.boost');
    if (logoutBtn) logoutBtn.textContent = t('startseite.logout');
    
    // Update whitepaper and roadmap buttons
    const whitepaperBtn = document.querySelector('a[href="../whitepaper_alt.html"]');
    const roadmapBtn = document.querySelector('button[onclick="showRoadmapPopup()"]');
    const whitepaperTip = document.querySelector('.text-gray-300.text-sm.mt-4');
    
    if (whitepaperBtn) whitepaperBtn.textContent = t('startseite.whitepaper');
    if (roadmapBtn) roadmapBtn.textContent = t('startseite.roadmap');
    if (whitepaperTip) whitepaperTip.textContent = t('startseite.whitepaper-tip');
    
    console.log('✅ Startseite elements updated');
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
    
    currentLanguage = language;
    localStorage.setItem('geodrop-language', currentLanguage);
    updateLanguageDisplay();
    applyLanguage();
    
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

// Update startseite button specifically / Startseite-Button spezifisch aktualisieren
window.updateStartseiteButton = function() {
    console.log('🔄 Updating startseite button specifically...');
    
    const languageFlag = document.getElementById('language-flag');
    const languageText = document.getElementById('language-text');
    
    if (languageFlag && languageText) {
        languageFlag.textContent = currentLanguage === 'de' ? '🇩🇪' : '🇺🇸';
        languageText.textContent = currentLanguage === 'de' ? 'DE' : 'EN';
        console.log('✅ Startseite button updated to:', currentLanguage === 'de' ? '🇩🇪 DE' : '🇺🇸 EN');
    } else {
        console.log('⚠️ Startseite button elements not found');
    }
};

// Update radio buttons specifically / Radio-Buttons spezifisch aktualisieren
window.updateRadioButtons = function() {
    console.log('🔄 Updating radio buttons specifically...');
    
    const langDe = document.getElementById('lang-de');
    const langEn = document.getElementById('lang-en');
    
    if (langDe && langEn) {
        // Force uncheck both first
        langDe.checked = false;
        langEn.checked = false;
        // Then set the correct one
        if (currentLanguage === 'de') {
            langDe.checked = true;
        } else if (currentLanguage === 'en') {
            langEn.checked = true;
        }
        console.log('✅ Radio buttons updated:', { de: langDe.checked, en: langEn.checked, current: currentLanguage });
    } else {
        console.log('⚠️ Radio buttons not found');
    }
};

// Expose for global access / Für globalen Zugriff bereitstellen
window.t = t;
window.initLanguageSystem = initLanguageSystem;
window.applyLanguage = applyLanguage;
window.updateLanguageDisplay = updateLanguageDisplay;
window.updateStartseiteButton = updateStartseiteButton;
window.updateRadioButtons = updateRadioButtons;

console.log('✅ Language system loaded');
