// Firebase Translations System
// Loads translations from Firebase based on tab navigation structure

class FirebaseTranslations {
    constructor() {
        this.translations = {};
        this.currentLanguage = 'de';
        this.isInitialized = false;
    }

    // Initialize the translations system
    async initialize() {
        try {
            console.log('🌍 Initializing Firebase Translations...');
            
            // Load current language from localStorage
            const savedLang = localStorage.getItem('geodrop-language');
            if (savedLang && (savedLang === 'de' || savedLang === 'en')) {
                this.currentLanguage = savedLang;
            }
            
            // Load translations for current page
            await this.loadTranslationsForCurrentPage();
            
            this.isInitialized = true;
            console.log('✅ Firebase Translations initialized successfully!');
            
        } catch (error) {
            console.error('❌ Error initializing Firebase Translations:', error);
        }
    }

    // Get current page name from URL or active page
    getCurrentPage() {
        const hash = window.location.hash;
        if (hash) {
            return hash.replace('#', '');
        }
        
        // Fallback: check active page
        const activePage = document.querySelector('.page.active');
        if (activePage) {
            return activePage.id;
        }
        
        return 'startseite'; // Default page
    }

    // Load translations for current page
    async loadTranslationsForCurrentPage() {
        try {
            const currentPage = this.getCurrentPage();
            console.log(`📄 Loading translations for page: ${currentPage}`);
            
            // Load translations from Firebase
            const db = window.firebase.firestore();
            const docRef = db.collection('translations').doc(currentPage);
            const doc = await docRef.get();
            
            if (doc.exists) {
                this.translations[currentPage] = doc.data();
                console.log(`✅ Translations loaded for ${currentPage}:`, this.translations[currentPage]);
                
                // Apply translations to current page
                this.applyTranslations(currentPage);
            } else {
                console.log(`⚠️ No translations found for page: ${currentPage}`);
            }
            
        } catch (error) {
            console.error('❌ Error loading translations:', error);
        }
    }

    // Apply translations to page elements
    applyTranslations(pageName) {
        try {
            const pageTranslations = this.translations[pageName];
            if (!pageTranslations) {
                console.log(`⚠️ No translations available for page: ${pageName}`);
                return;
            }

            const currentLangTranslations = pageTranslations[this.currentLanguage];
            if (!currentLangTranslations) {
                console.log(`⚠️ No translations available for language: ${this.currentLanguage}`);
                return;
            }

            // Find all elements with data-translate attribute
            const elements = document.querySelectorAll('[data-translate]');
            console.log(`🔄 Applying translations to ${elements.length} elements...`);

            elements.forEach(element => {
                const key = element.getAttribute('data-translate');
                if (currentLangTranslations[key]) {
                    if (element.tagName === 'INPUT' && element.type !== 'submit') {
                        element.placeholder = currentLangTranslations[key];
                    } else {
                        element.textContent = currentLangTranslations[key];
                    }
                    console.log(`✅ Updated element with key: ${key}`);
                } else {
                    console.log(`⚠️ No translation found for key: ${key}`);
                }
            });

        } catch (error) {
            console.error('❌ Error applying translations:', error);
        }
    }

    // Switch language
    async switchLanguage(newLanguage) {
        try {
            console.log(`🔄 Switching language to: ${newLanguage}`);
            
            this.currentLanguage = newLanguage;
            localStorage.setItem('geodrop-language', newLanguage);
            
            // Reload translations for current page
            await this.loadTranslationsForCurrentPage();
            
            console.log(`✅ Language switched to: ${newLanguage}`);
            
        } catch (error) {
            console.error('❌ Error switching language:', error);
        }
    }

    // Get translation for a specific key
    getTranslation(key, pageName = null) {
        try {
            const page = pageName || this.getCurrentPage();
            const pageTranslations = this.translations[page];
            
            if (pageTranslations && pageTranslations[this.currentLanguage]) {
                return pageTranslations[this.currentLanguage][key] || key;
            }
            
            return key; // Fallback to key if translation not found
            
        } catch (error) {
            console.error('❌ Error getting translation:', error);
            return key;
        }
    }

    // Reload translations (useful when page changes)
    async reloadTranslations() {
        try {
            console.log('🔄 Reloading translations...');
            await this.loadTranslationsForCurrentPage();
        } catch (error) {
            console.error('❌ Error reloading translations:', error);
        }
    }
}

// Create global instance
window.firebaseTranslations = new FirebaseTranslations();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.firebaseTranslations) {
        window.firebaseTranslations.initialize();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirebaseTranslations;
}
