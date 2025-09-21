// UI Utility Functions for GeoDrop App

window.uploadPhoto = function() {
    const input = document.getElementById('photo-input');
    if (input && input.files.length > 0) {
        showMessage('📸 Foto wird hochgeladen...', false);
    } else {
        showMessage('❌ Bitte wähle ein Foto aus', true);
    }
};

// Missing functions that are called by other pages
window.claimDailyBonus = function() {
    showMessage('🎁 Täglicher Bonus abgeholt! +50 PixelDrops', false);
    if (typeof createFloatingElement === 'function') {
        createFloatingElement('+50', '#10b981');
    }
};

// These functions are already in common.js but kept here for compatibility
window.createFloatingElement = function(text, color = '#667eea') {
    const element = document.createElement('div');
    element.className = 'floating-element';
    element.textContent = text;
    element.style.color = color;
    element.style.position = 'fixed';
    element.style.top = '50%';
    element.style.left = '50%';
    element.style.transform = 'translate(-50%, -50%)';
    element.style.fontSize = '3rem';
    element.style.zIndex = '1000';
    element.style.pointerEvents = 'none';
    
    document.body.appendChild(element);
    
    setTimeout(() => {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }, 1500);
};

window.createBonusParticles = function(count = 5) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'bonus-particle';
            particle.textContent = '💰';
            particle.style.position = 'fixed';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = window.innerHeight + 'px';
            particle.style.fontSize = '2rem';
            particle.style.zIndex = '2000';
            particle.style.pointerEvents = 'none';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }, i * 100);
    }
};
