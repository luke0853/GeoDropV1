// Firebase Translations Setup Script
// This script creates the translations collection structure

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  // Your Firebase config here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// GeoCard Translations Data
const geocardTranslations = {
  de: {
    // Upload-Fenster Texte
    "select-geodrop": "GeoDrop auswählen:",
    "select-dev-geodrop": "Dev GeoDrop auswählen...",
    "loading-user-drops": "Lade User GeoDrops...",
    "dev-test-coordinates": "🔧 DEV: Test-Koordinaten eingeben:",
    "latitude": "Breitengrad:",
    "longitude": "Längengrad:",
    "set-test-coordinates": "📍 Test-Koordinaten setzen",
    "dev-test-warning": "⚠️ Nur für Dev-Tests - normale User sehen dies nicht!",
    "create-test-melk": "🏛️ Test-Drop: Stift Melk erstellen",
    "create-test-schonbrunn": "🏰 Test-Drop: Schloss Schönbrunn erstellen",
    "create-all-states": "🇦🇹 Alle 9 Bundesländer-Drops erstellen",
    "create-remaining-states": "🚀 Restliche 8 Bundesländer-Drops erstellen",
    "reload-all-lists": "🔄 Alle Listen neu laden",
    "clear-user-drops": "🧹 User Drop Listen leeren",
    "restore-user-drops": "🔄 User Drop Listen wiederherstellen",
    "check-user-drop-count": "📊 User Drop Anzahl prüfen",
    "cleanup-duplicates": "🧹 Duplikate bereinigen",
    "create-missing-drop1": "🏛️ Drop Nr. 1 (Stift Melk) erstellen",
    "dev-select-image": "🖼️ Bild auswählen (Dev)",
    "dev-coordinate-adjustment": "🎯 Dev Koordinaten-Anpassung",
    "latitude-lat": "Breitengrad (Lat)"
  },
  en: {
    // English translations
    "select-geodrop": "Select GeoDrop:",
    "select-dev-geodrop": "Select Dev GeoDrop...",
    "loading-user-drops": "Loading User GeoDrops...",
    "dev-test-coordinates": "🔧 DEV: Enter Test Coordinates:",
    "latitude": "Latitude:",
    "longitude": "Longitude:",
    "set-test-coordinates": "📍 Set Test Coordinates",
    "dev-test-warning": "⚠️ Only for Dev tests - normal users don't see this!",
    "create-test-melk": "🏛️ Test Drop: Create Melk Abbey",
    "create-test-schonbrunn": "🏰 Test Drop: Create Schönbrunn Palace",
    "create-all-states": "🇦🇹 Create All 9 State Drops",
    "create-remaining-states": "🚀 Create Remaining 8 State Drops",
    "reload-all-lists": "🔄 Reload All Lists",
    "clear-user-drops": "🧹 Clear User Drop Lists",
    "restore-user-drops": "🔄 Restore User Drop Lists",
    "check-user-drop-count": "📊 Check User Drop Count",
    "cleanup-duplicates": "🧹 Cleanup Duplicates",
    "create-missing-drop1": "🏛️ Create Drop No. 1 (Melk Abbey)",
    "dev-select-image": "🖼️ Select Image (Dev)",
    "dev-coordinate-adjustment": "🎯 Dev Coordinate Adjustment",
    "latitude-lat": "Latitude (Lat)"
  }
};

// Function to create translations collection
async function createTranslationsCollection() {
  try {
    console.log('🚀 Creating translations collection...');
    
    // Create geocard document in translations collection
    await setDoc(doc(db, 'translations', 'geocard'), geocardTranslations);
    
    console.log('✅ GeoCard translations created successfully!');
    console.log('📁 Collection: translations');
    console.log('📄 Document: geocard');
    console.log('🌍 Languages: de, en');
    
  } catch (error) {
    console.error('❌ Error creating translations:', error);
  }
}

// Run the setup
createTranslationsCollection();
