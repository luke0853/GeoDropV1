// Upload translations using Firebase v8 (same as the app)
const admin = require('firebase-admin');

// Initialize Firebase Admin (you'll need to set up service account)
const serviceAccount = require('./path-to-service-account.json'); // You need this file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'geodropv1'
});

const db = admin.firestore();

// GeoBoard Tab Translations
const geoboardTranslations = {
  de: {
    "geoboard-title": "📊 GeoBoard",
    "geoboard-leaderboard": "🏆 Rangliste",
    "geoboard-statistics": "📈 Statistiken",
    "geoboard-your-statistics": "📈 Deine Statistiken",
    "geoboard-global-statistics": "🌍 Globale Statistiken",
    "geoboard-loading-leaderboard": "Lade Rangliste...",
    "geoboard-username": "Username:",
    "geoboard-pixeldrops": "PixelDrops:",
    "geoboard-tbnb": "tBNB:",
    "geoboard-drops": "Drops:",
    "geoboard-boost": "Boost:",
    "geoboard-rank": "Rang:",
    "geoboard-users": "User",
    "geoboard-packages": "Packages",
    "geoboard-total-pixeldrops": "Gesamt-PixelDrop:",
    "geoboard-total-tbnb": "Gesamt-tBNB:",
    "geoboard-total-drops": "Gesamt-Drops:",
    "geoboard-total-packages": "Gesamt-Pakete:"
  },
  en: {
    "geoboard-title": "📊 GeoBoard",
    "geoboard-leaderboard": "🏆 Leaderboard",
    "geoboard-statistics": "📈 Statistics",
    "geoboard-your-statistics": "📈 Your Statistics",
    "geoboard-global-statistics": "🌍 Global Statistics",
    "geoboard-loading-leaderboard": "Loading leaderboard...",
    "geoboard-username": "Username:",
    "geoboard-pixeldrops": "PixelDrops:",
    "geoboard-tbnb": "tBNB:",
    "geoboard-drops": "Drops:",
    "geoboard-boost": "Boost:",
    "geoboard-rank": "Rank:",
    "geoboard-users": "Users",
    "geoboard-packages": "Packages",
    "geoboard-total-pixeldrops": "Total PixelDrops:",
    "geoboard-total-tbnb": "Total tBNB:",
    "geoboard-total-drops": "Total Drops:",
    "geoboard-total-packages": "Total Packages:"
  }
};

// Colloseum Tab Translations
const colloseumTranslations = {
  de: {
    "colloseum-title": "🏛️ Colloseum",
    "colloseum-nomination": "🎯 Nominierung",
    "colloseum-rating": "⭐ Bewertung",
    "colloseum-top-5": "🏆 Top 5",
    "colloseum-nominations-today": "Nominierungen heute:",
    "colloseum-reward-per-nomination": "Belohnung pro Nominierung:",
    "colloseum-nominate-image": "🎯 Bild nominieren",
    "colloseum-ratings-today": "Bewertungen heute:",
    "colloseum-next-settlement": "Nächste Abrechnung:",
    "colloseum-rate-images": "⭐ Bilder bewerten",
    "colloseum-nominated-images": "📸 Nominierte Bilder (diese Woche)",
    "colloseum-loading-top-5": "Lade Top 5...",
    "colloseum-loading-nominated": "Lade nominierte Bilder...",
    "colloseum-no-ratings-yet": "Noch keine Bewertungen",
    "colloseum-no-nominated-this-week": "Noch keine nominierte Bilder diese Woche",
    "colloseum-limit-reached": "Limit erreicht",
    "colloseum-sunday-24": "Sonntag 24:00",
    "colloseum-5-pixeldrops": "5 PixelDrops",
    "colloseum-nominate-modal-title": "🎯 Bild nominieren",
    "colloseum-choose-image": "Wähle ein Bild aus, das du für das Colloseum nominieren möchtest:",
    "colloseum-nomination-reward": "Du erhältst 5 PixelDrops pro Nominierung (max. 3 pro Tag)",
    "colloseum-loading-available": "Lade verfügbare Bilder...",
    "colloseum-no-available-images": "Keine verfügbaren Bilder zum Nominieren",
    "colloseum-error-loading-images": "Fehler beim Laden der Bilder",
    "colloseum-nominate": "🎯 Nominieren",
    "colloseum-like": "❤️ Like",
    "colloseum-image-nominated": "Bild erfolgreich nominiert! Du erhältst 5 PixelDrops.",
    "colloseum-image-liked": "✅ Bild geliked!",
    "colloseum-already-liked": "Du hast dieses Bild bereits geliked!",
    "colloseum-rating-limit-reached": "Du hast heute bereits 3 Bilder bewertet!",
    "colloseum-please-login": "Bitte zuerst anmelden!",
    "colloseum-error-liking": "❌ Fehler beim Liken des Bildes",
    "colloseum-error-nominating": "❌ Fehler beim Nominieren des Bildes",
    "colloseum-image-not-found": "❌ Bild nicht gefunden"
  },
  en: {
    "colloseum-title": "🏛️ Colloseum",
    "colloseum-nomination": "🎯 Nomination",
    "colloseum-rating": "⭐ Rating",
    "colloseum-top-5": "🏆 Top 5",
    "colloseum-nominations-today": "Nominations today:",
    "colloseum-reward-per-nomination": "Reward per nomination:",
    "colloseum-nominate-image": "🎯 Nominate Image",
    "colloseum-ratings-today": "Ratings today:",
    "colloseum-next-settlement": "Next settlement:",
    "colloseum-rate-images": "⭐ Rate Images",
    "colloseum-nominated-images": "📸 Nominated Images (this week)",
    "colloseum-loading-top-5": "Loading Top 5...",
    "colloseum-loading-nominated": "Loading nominated images...",
    "colloseum-no-ratings-yet": "No ratings yet",
    "colloseum-no-nominated-this-week": "No nominated images this week yet",
    "colloseum-limit-reached": "Limit reached",
    "colloseum-sunday-24": "Sunday 24:00",
    "colloseum-5-pixeldrops": "5 PixelDrops",
    "colloseum-nominate-modal-title": "🎯 Nominate Image",
    "colloseum-choose-image": "Choose an image you want to nominate for the Colloseum:",
    "colloseum-nomination-reward": "You get 5 PixelDrops per nomination (max. 3 per day)",
    "colloseum-loading-available": "Loading available images...",
    "colloseum-no-available-images": "No available images to nominate",
    "colloseum-error-loading-images": "Error loading images",
    "colloseum-nominate": "🎯 Nominate",
    "colloseum-like": "❤️ Like",
    "colloseum-image-nominated": "Image successfully nominated! You get 5 PixelDrops.",
    "colloseum-image-liked": "✅ Image liked!",
    "colloseum-already-liked": "You have already liked this image!",
    "colloseum-rating-limit-reached": "You have already rated 3 images today!",
    "colloseum-please-login": "Please login first!",
    "colloseum-error-liking": "❌ Error liking image",
    "colloseum-error-nominating": "❌ Error nominating image",
    "colloseum-image-not-found": "❌ Image not found"
  }
};

// Referrals Tab Translations
const referralsTranslations = {
  de: {
    "referrals-title": "👥 Referrals",
    "referrals-statistics": "📊 Referral Statistiken",
    "referrals-your-referral-link": "🔗 Dein Referral Link",
    "referrals-your-referrals": "👥 Deine Referrals",
    "referrals-direct-referrals": "Direkte Referrals:",
    "referrals-referral-earnings": "Referral Einnahmen:",
    "referrals-active-referrals": "Aktive Referrals:",
    "referrals-your-referral-code": "Dein Referral Code:",
    "referrals-share-link": "Teile diesen Link mit Freunden:",
    "referrals-copy": "📋 Kopieren",
    "referrals-rewards": "💰 Belohnungen",
    "referrals-how-it-works": "📋 Wie funktioniert das Referral-System?",
    "referrals-direct-referrals-5": "🎯 Direkte Referrals (5%):",
    "referrals-indirect-referrals-1": "🔄 Indirekte Referrals (1%):",
    "referrals-automatic-system": "⚡ Automatisches System:",
    "referrals-indirect-referrals": "🔄 Indirekte Referrals",
    "referrals-loading-referrals": "Lade Referrals...",
    "referrals-link-copied": "✅ Referral-Link kopiert!",
    "referrals-error-copying": "❌ Fehler beim Kopieren des Links",
    "referrals-loading-indirect": "Lade indirekte Referrals...",
    "referrals-error-loading-indirect": "Fehler beim Laden der indirekten Referrals",
    "referrals-no-direct-referrals": "Noch keine direkten Referrals",
    "referrals-no-indirect-referrals": "Noch keine indirekten Referrals",
    "referrals-indirect-explanation": "Diese Liste zeigt alle User, die von deinen direkten Referrals geworben wurden. Du erhältst 1% von deren Käufen.",
    "referrals-indirect-explanation-2": "Indirekte Referrals entstehen, wenn deine Referrals selbst User werben.",
    "referrals-indirect-explanation-3": "Deine direkten Referrals haben noch niemanden geworben.",
    "referrals-total-indirect": "Gesamt indirekte Referrals:",
    "referrals-total-earnings-1": "Gesamt Einnahmen (1%):",
    "referrals-joined": "Beigetreten:",
    "referrals-referred-by": "Geworben von:",
    "referrals-active": "Aktiv",
    "referrals-inactive": "Inaktiv",
    "referrals-earned": "Verdient:"
  },
  en: {
    "referrals-title": "👥 Referrals",
    "referrals-statistics": "📊 Referral Statistics",
    "referrals-your-referral-link": "🔗 Your Referral Link",
    "referrals-your-referrals": "👥 Your Referrals",
    "referrals-direct-referrals": "Direct Referrals:",
    "referrals-referral-earnings": "Referral Earnings:",
    "referrals-active-referrals": "Active Referrals:",
    "referrals-your-referral-code": "Your Referral Code:",
    "referrals-share-link": "Share this link with friends:",
    "referrals-copy": "📋 Copy",
    "referrals-rewards": "💰 Rewards",
    "referrals-how-it-works": "📋 How does the Referral System work?",
    "referrals-direct-referrals-5": "🎯 Direct Referrals (5%):",
    "referrals-indirect-referrals-1": "🔄 Indirect Referrals (1%):",
    "referrals-automatic-system": "⚡ Automatic System:",
    "referrals-indirect-referrals": "🔄 Indirect Referrals",
    "referrals-loading-referrals": "Loading referrals...",
    "referrals-link-copied": "✅ Referral link copied!",
    "referrals-error-copying": "❌ Error copying link",
    "referrals-loading-indirect": "Loading indirect referrals...",
    "referrals-error-loading-indirect": "Error loading indirect referrals",
    "referrals-no-direct-referrals": "No direct referrals yet",
    "referrals-no-indirect-referrals": "No indirect referrals yet",
    "referrals-indirect-explanation": "This list shows all users who were referred by your direct referrals. You get 1% of their purchases.",
    "referrals-indirect-explanation-2": "Indirect referrals are created when your referrals refer users themselves.",
    "referrals-indirect-explanation-3": "Your direct referrals haven't referred anyone yet.",
    "referrals-total-indirect": "Total indirect referrals:",
    "referrals-total-earnings-1": "Total earnings (1%):",
    "referrals-joined": "Joined:",
    "referrals-referred-by": "Referred by:",
    "referrals-active": "Active",
    "referrals-inactive": "Inactive",
    "referrals-earned": "Earned:"
  }
};

// Upload function
async function uploadTranslations() {
  try {
    console.log('🚀 Uploading GeoBoard translations to Firebase...');
    
    // Upload each tab separately
    await db.collection('translations').doc('geoboard').set(geoboardTranslations);
    console.log('✅ GeoBoard tab uploaded');
    
    await db.collection('translations').doc('colloseum').set(colloseumTranslations);
    console.log('✅ Colloseum tab uploaded');
    
    await db.collection('translations').doc('referrals').set(referralsTranslations);
    console.log('✅ Referrals tab uploaded');
    
    console.log('🎉 All GeoBoard translations uploaded successfully!');
    console.log('📁 Collection: translations');
    console.log('📄 Documents: geoboard, colloseum, referrals');
    console.log('🌍 Languages: de, en');
    
  } catch (error) {
    console.error('❌ Error uploading translations:', error);
  }
}

// Run the upload
uploadTranslations();
