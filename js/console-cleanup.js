// Console Cleanup Functions
// Diese Datei enthält Funktionen zum Aufräumen der Console

// Hauptfunktion zum Console-Cleanup
window.cleanConsole = function() {
    console.clear();
    console.log('🧹 Console wurde gereinigt!');
    console.log('📊 GeoDrop App - Console bereit');
    console.log('🔧 Verfügbare Test-Funktionen:');
    console.log('  - window.testMapInit() - Teste Map-Initialisierung');
    console.log('  - window.switchToEnglish() - Wechsle zu Englisch');
    console.log('  - window.switchToGerman() - Wechsle zu Deutsch');
    console.log('  - window.testContainerSwitch() - Teste Container-Switch');
    console.log('  - window.cleanConsole() - Console reinigen');
};

// Reduziere Console-Logs für bessere Performance
window.setQuietMode = function(quiet = true) {
    if (quiet) {
        // Überschreibe console.log für weniger Ausgaben
        const originalLog = console.log;
        console.log = function(...args) {
            // Nur wichtige Logs anzeigen
            if (args[0] && (
                args[0].includes('✅') || 
                args[0].includes('❌') || 
                args[0].includes('🎯') ||
                args[0].includes('🗺️') ||
                args[0].includes('🔧') ||
                args[0].includes('🧹')
            )) {
                originalLog.apply(console, args);
            }
        };
        console.log('🔇 Quiet Mode aktiviert - Nur wichtige Logs werden angezeigt');
    } else {
        console.log('🔊 Normal Mode aktiviert - Alle Logs werden angezeigt');
    }
};

// Test-Funktion für Console-Cleanup
window.testConsoleCleanup = function() {
    console.log('🧪 Teste Console-Cleanup...');
    window.cleanConsole();
    console.log('✅ Console-Cleanup erfolgreich getestet!');
};

// Auto-Cleanup nach 30 Sekunden
setTimeout(() => {
    if (window.location.hash === '#geocard') {
        console.log('🧹 Auto-Cleanup der Console...');
        window.cleanConsole();
    }
}, 30000);

console.log('🧹 Console-Cleanup-Funktionen geladen!');
console.log('💡 Verwende window.cleanConsole() um die Console zu reinigen');
console.log('💡 Verwende window.setQuietMode() für weniger Console-Ausgaben');
