// Backup Analytics System - Alternative zu Firebase Analytics
// Falls Firebase Analytics nicht funktioniert, verwende diese Methode

class BackupAnalytics {
    constructor() {
        this.events = [];
        this.isEnabled = true;
        this.endpoint = 'https://api.geodrop.app/analytics'; // Fallback endpoint
        this.localStorageKey = 'geodrop_analytics_events';
        this.maxEvents = 100;
        
        // Load stored events
        this.loadStoredEvents();
        
        // Send events every 30 seconds
        setInterval(() => {
            this.sendStoredEvents();
        }, 30000);
        
        // Send events on page unload
        window.addEventListener('beforeunload', () => {
            this.sendStoredEvents(true);
        });
    }
    
    logEvent(eventName, parameters = {}) {
        if (!this.isEnabled) return;
        
        const event = {
            event_name: eventName,
            parameters: parameters,
            timestamp: new Date().toISOString(),
            user_id: window.currentUser?.uid || 'anonymous',
            session_id: this.getSessionId(),
            page_url: window.location.href,
            user_agent: navigator.userAgent
        };
        
        this.events.push(event);
        console.log('📊 Backup Analytics Event:', event);
        
        // Store in localStorage
        this.storeEvents();
        
        // Try to send immediately
        this.sendEvent(event);
    }
    
    getSessionId() {
        let sessionId = sessionStorage.getItem('geodrop_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('geodrop_session_id', sessionId);
        }
        return sessionId;
    }
    
    storeEvents() {
        try {
            const eventsToStore = this.events.slice(-this.maxEvents); // Keep only last 100 events
            localStorage.setItem(this.localStorageKey, JSON.stringify(eventsToStore));
        } catch (error) {
            console.error('❌ Error storing analytics events:', error);
        }
    }
    
    loadStoredEvents() {
        try {
            const stored = localStorage.getItem(this.localStorageKey);
            if (stored) {
                this.events = JSON.parse(stored);
                console.log(`📊 Loaded ${this.events.length} stored analytics events`);
            }
        } catch (error) {
            console.error('❌ Error loading stored analytics events:', error);
            this.events = [];
        }
    }
    
    async sendEvent(event) {
        try {
            // Try to send to Firebase first (if available)
            if (window.analytics && typeof window.analytics.logEvent === 'function') {
                window.analytics.logEvent(event.event_name, event.parameters);
                console.log('📊 Event sent to Firebase Analytics');
            }
            
            // Also try to send to backup endpoint
            if (navigator.sendBeacon) {
                const data = JSON.stringify(event);
                navigator.sendBeacon(this.endpoint, data);
                console.log('📊 Event sent via sendBeacon');
            }
        } catch (error) {
            console.error('❌ Error sending analytics event:', error);
        }
    }
    
    async sendStoredEvents(force = false) {
        if (this.events.length === 0) return;
        
        try {
            // Send all stored events
            for (const event of this.events) {
                await this.sendEvent(event);
            }
            
            // Clear sent events
            this.events = [];
            this.storeEvents();
            
            console.log('📊 All stored events sent');
        } catch (error) {
            console.error('❌ Error sending stored events:', error);
        }
    }
    
    // Analytics functions that match Firebase Analytics API
    pageView(pageTitle, pageLocation, pagePath) {
        this.logEvent('page_view', {
            page_title: pageTitle || document.title,
            page_location: pageLocation || window.location.href,
            page_path: pagePath || window.location.pathname
        });
    }
    
    userAction(action, details = {}) {
        this.logEvent('user_action', {
            action: action,
            ...details
        });
    }
    
    featureUsage(feature, details = {}) {
        this.logEvent('feature_usage', {
            feature: feature,
            ...details
        });
    }
    
    pageNavigation(fromPage, toPage) {
        this.logEvent('page_navigation', {
            from_page: fromPage,
            to_page: toPage
        });
    }
    
    errorOccurred(error, context = {}) {
        this.logEvent('error_occurred', {
            error_message: error.message || error,
            error_stack: error.stack || 'No stack trace',
            context: JSON.stringify(context)
        });
    }
    
    // Get analytics data for display
    getAnalyticsData() {
        return {
            total_events: this.events.length,
            events: this.events,
            session_id: this.getSessionId(),
            is_enabled: this.isEnabled
        };
    }
}

// Initialize backup analytics
window.backupAnalytics = new BackupAnalytics();

// Make it globally available
window.trackEventBackup = function(eventName, parameters = {}) {
    window.backupAnalytics.logEvent(eventName, parameters);
};

window.trackPageViewBackup = function(pageTitle, pageLocation, pagePath) {
    window.backupAnalytics.pageView(pageTitle, pageLocation, pagePath);
};

window.trackUserActionBackup = function(action, details = {}) {
    window.backupAnalytics.userAction(action, details);
};

window.trackFeatureUsageBackup = function(feature, details = {}) {
    window.backupAnalytics.featureUsage(feature, details);
};

console.log('📊 Backup Analytics System initialized');
