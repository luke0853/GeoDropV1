// GeoChat Functions for GeoDrop App

// Function to format message text and make URLs clickable - XSS SECURE
window.formatMessageText = function(text) {
    if (!text) return '';
    
    // SECURITY: Escape HTML to prevent XSS attacks
    const escapeHtml = (unsafe) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };
    
    // Escape the text first
    const escapedText = escapeHtml(text);
    
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Replace URLs with clickable links (URLs are already escaped)
    return escapedText.replace(urlRegex, function(url) {
        // Double-check URL is safe (basic validation)
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">${escapeHtml(url)}</a>`;
        }
        return escapeHtml(url);
    });
};

// GeoChat functions - global functions
window.sendMessage = async function() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // SECURITY: Validate message length and content
    if (message.length > 500) {
        alert('❌ Nachricht zu lang! Maximal 500 Zeichen erlaubt.');
        return;
    }
    
    // SECURITY: Basic XSS prevention
    if (message.includes('<script') || message.includes('javascript:')) {
        alert('❌ Ungültige Zeichen in der Nachricht!');
        return;
    }
    
    const user = auth.currentUser;
    if (!user) {
        alert('❌ Bitte melde dich an um zu chatten!');
        return;
    }
    
    // Get the real username from Firebase users collection
    let username = 'User';
    try {
        // First try to get from global userProfile
        if (window.userProfile && window.userProfile.username) {
            username = window.userProfile.username;
        } else {
            // Load user profile from Firebase users collection
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                username = userData.username || userData.email?.split('@')[0] || 'User';
                console.log('✅ Loaded username from Firebase:', username);
            } else {
                // Fallback to email prefix if no user document exists
                username = user.email?.split('@')[0] || 'User';
                console.log('⚠️ No user document found, using email prefix:', username);
            }
        }
    } catch (error) {
        console.error('❌ Error loading user profile for chat:', error);
        username = user.email?.split('@')[0] || 'User';
    }
    
    // Add message to Firebase
    db.collection('chatMessages').add({
        text: message,
        userId: user.uid,
        username: username,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userEmail: user.email
    }).then(() => {
        input.value = '';
        console.log('✅ Message sent with username:', username);
    }).catch(error => {
        console.error('❌ Error sending message:', error);
        alert('❌ Fehler beim Senden der Nachricht!');
    });
};

window.loadChatMessages = function() {
    const messagesRef = db.collection('chatMessages')
        .orderBy('timestamp', 'desc')
        .limit(50);
    
    messagesRef.onSnapshot(async (snapshot) => {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        let html = '';
        
        // Process messages and get real usernames
        for (const doc of snapshot.docs.reverse()) {
            const data = doc.data();
            const timestamp = data.timestamp ? data.timestamp.toDate() : new Date();
            const timeStr = timestamp.toLocaleTimeString('de-DE', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            const isCurrentUser = auth.currentUser && data.userId === auth.currentUser.uid;
            const messageClass = isCurrentUser ? 'bg-blue-600' : 'bg-gray-600';
            const alignClass = isCurrentUser ? 'ml-auto' : 'mr-auto';
            
            // Get real username from Firebase users collection
            let displayUsername = data.username || 'User';
            
            // If username looks like an email or is generic, try to get real username
            if (displayUsername.includes('@') || displayUsername === 'User' || displayUsername === 'Anonym') {
                try {
                    const userDoc = await db.collection('users').doc(data.userId).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        displayUsername = userData.username || userData.email?.split('@')[0] || 'User';
                    }
                } catch (error) {
                    console.error('❌ Error loading username for message:', error);
                    // Keep original username as fallback
                }
            }
            
            html += `
                <div class="chat-message ${alignClass} max-w-xs lg:max-w-md">
                    <div class="${messageClass} rounded-lg p-3">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-xs font-semibold text-gray-300">${displayUsername}</span>
                            <span class="text-xs text-gray-400">${timeStr}</span>
                        </div>
                        <p class="text-white">${formatMessageText(data.text)}</p>
                    </div>
                </div>
            `;
        }
        
        if (html === '') {
            html = `
                <div class="text-center text-gray-400 py-8">
                    <p>💬 Willkommen im GeoChat!</p>
                    <p class="text-sm mt-2">Chatte mit anderen GeoDrop-Spielern</p>
                </div>
            `;
        }
        
        chatMessages.innerHTML = html;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, (error) => {
        console.error('❌ Error loading chat messages:', error);
    });
};

window.updateChatStats = function() {
    // Update total messages
    db.collection('chatMessages').get().then(snapshot => {
        const totalEl = document.getElementById('total-messages');
        if (totalEl) totalEl.textContent = snapshot.size;
    });
    
    // Update today's messages
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    db.collection('chatMessages')
        .where('timestamp', '>=', today)
        .get()
        .then(snapshot => {
            const todayEl = document.getElementById('today-messages');
            if (todayEl) todayEl.textContent = snapshot.size;
        });
    
    // Update active users (simplified)
    const activeEl = document.getElementById('active-users');
    if (activeEl) activeEl.textContent = '1+';
};

// Update chat statistics
window.updateChatStats = function() {
    if (!db) return;
    
    // Get total messages count
    db.collection('chatMessages').get().then(snapshot => {
        const totalMessages = document.getElementById('total-messages');
        if (totalMessages) {
            totalMessages.textContent = snapshot.size;
        }
    });
    
    // Get today's messages count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    db.collection('chatMessages')
        .where('timestamp', '>=', today)
        .get()
        .then(snapshot => {
            const todayMessages = document.getElementById('today-messages');
            if (todayMessages) {
                todayMessages.textContent = snapshot.size;
            }
        });
    
    // Get active users count (users who sent messages in last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    db.collection('chatMessages')
        .where('timestamp', '>=', yesterday)
        .get()
        .then(snapshot => {
            const uniqueUsers = new Set();
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.userId) {
                    uniqueUsers.add(data.userId);
                }
            });
            
            const activeUsers = document.getElementById('active-users');
            if (activeUsers) {
                activeUsers.textContent = uniqueUsers.size;
            }
        });
    
    console.log('✅ Chat stats updated');
};

// Function to update existing chat messages with usernames instead of emails
window.updateChatUsernames = async function() {
    try {
        console.log('🔄 Updating chat usernames...');
        
        if (!db) {
            console.log('❌ Database not available');
            return;
        }
        
        // Get all chat messages
        const messagesSnapshot = await db.collection('chatMessages').get();
        let updatedCount = 0;
        
        for (const doc of messagesSnapshot.docs) {
            const data = doc.data();
            
            // Check if username looks like an email or is generic
            if (data.username && (data.username.includes('@') || data.username === 'User' || data.username === 'Anonym')) {
                try {
                    // Try to get user data by userId
                    const userDoc = await db.collection('users').doc(data.userId).get();
                    
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        const newUsername = userData.username || userData.email?.split('@')[0] || 'User';
                        
                        // Update the message with the new username
                        await doc.ref.update({
                            username: newUsername
                        });
                        
                        updatedCount++;
                        console.log(`✅ Updated message from ${data.username} to ${newUsername}`);
                    } else {
                        // If no user document exists, try to find by email
                        if (data.username.includes('@')) {
                            const userQuery = await db.collection('users')
                                .where('email', '==', data.username)
                                .limit(1)
                                .get();
                            
                            if (!userQuery.empty) {
                                const userData = userQuery.docs[0].data();
                                const newUsername = userData.username || userData.email?.split('@')[0] || 'User';
                                
                                // Update the message with the new username
                                await doc.ref.update({
                                    username: newUsername
                                });
                                
                                updatedCount++;
                                console.log(`✅ Updated message from ${data.username} to ${newUsername}`);
                            }
                        }
                    }
                } catch (error) {
                    console.error(`❌ Error updating message ${doc.id}:`, error);
                }
            }
        }
        
        console.log(`✅ Updated ${updatedCount} chat messages with usernames`);
        if (updatedCount > 0) {
            // Reload chat messages to show updated usernames
            if (typeof window.loadChatMessages === 'function') {
                window.loadChatMessages();
            }
        }
        
    } catch (error) {
        console.error('❌ Error updating chat usernames:', error);
    }
};

// Auto-update chat usernames when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Firebase to be ready, then update usernames
    setTimeout(() => {
        if (typeof window.updateChatUsernames === 'function') {
            window.updateChatUsernames();
        }
    }, 3000);
});