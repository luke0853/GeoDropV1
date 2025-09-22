// GeoChat Functions for GeoDrop App

// GeoChat functions - global functions
window.sendMessage = async function() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    const user = auth.currentUser;
    if (!user) {
        alert('❌ Bitte melde dich an um zu chatten!');
        return;
    }
    
    // Get the real username from user profile
    let username = 'User';
    try {
        if (window.userProfile && window.userProfile.username) {
            username = window.userProfile.username;
        } else {
            // Try to load user profile from Firebase
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                username = userData.username || user.displayName || 'User';
            }
        }
    } catch (error) {
        console.error('❌ Error loading user profile for chat:', error);
        username = user.displayName || 'User';
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
    
    messagesRef.onSnapshot((snapshot) => {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        let html = '';
        snapshot.docs.reverse().forEach(doc => {
            const data = doc.data();
            const timestamp = data.timestamp ? data.timestamp.toDate() : new Date();
            const timeStr = timestamp.toLocaleTimeString('de-DE', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            const isCurrentUser = auth.currentUser && data.userId === auth.currentUser.uid;
            const messageClass = isCurrentUser ? 'bg-blue-600' : 'bg-gray-600';
            const alignClass = isCurrentUser ? 'ml-auto' : 'mr-auto';
            
            // Clean username - remove email addresses and use only username
            let displayUsername = data.username || 'User';
            if (displayUsername.includes('@')) {
                // If username is an email, use 'User' as fallback
                displayUsername = 'User';
            }
            
            html += `
                <div class="chat-message ${alignClass} max-w-xs lg:max-w-md">
                    <div class="${messageClass} rounded-lg p-3">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-xs font-semibold text-gray-300">${displayUsername}</span>
                            <span class="text-xs text-gray-400">${timeStr}</span>
                        </div>
                        <p class="text-white">${data.text}</p>
                    </div>
                </div>
            `;
        });
        
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
            
            // Check if username looks like an email
            if (data.username && data.username.includes('@')) {
                try {
                    // Try to find user by email and get their username
                    const userQuery = await db.collection('users')
                        .where('email', '==', data.username)
                        .limit(1)
                        .get();
                    
                    if (!userQuery.empty) {
                        const userData = userQuery.docs[0].data();
                        const newUsername = userData.username || data.username;
                        
                        // Update the message with the new username
                        await doc.ref.update({
                            username: newUsername
                        });
                        
                        updatedCount++;
                        console.log(`✅ Updated message from ${data.username} to ${newUsername}`);
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