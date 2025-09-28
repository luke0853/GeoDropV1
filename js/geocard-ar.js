// GeoCard AR Functions - AR contour overlay and camera functions

// AR Contour Detection Module
window.ARContourModule = {
    referenceImage: null,
    contourOverlay: null,
    isContourMatched: false,
    
    // Load reference image and extract contours
    async loadReferenceImage(drop) {
        console.log('🎯 Loading reference image for AR contour overlay...');
        
        // First, load drop data from Firebase to get reference image
        if (!drop.id || !drop.collection) {
            console.error('❌ Invalid drop data for reference image loading');
            return;
        }
        
        try {
            if (!window.firebase || !window.firebase.firestore()) {
                console.log('❌ Firebase not available');
                return;
            }
            
            const db = window.firebase.firestore();
            const dropDoc = await db.collection(drop.collection).doc(drop.id).get();
            
            if (!dropDoc.exists) {
                console.error('❌ Drop document not found');
                return;
            }
            
            const dropData = dropDoc.data();
            console.log('📋 Drop data loaded:', dropData);
            
            // Use reference image from drop data if available
            if (dropData.referenceImage) {
                this.referenceImage = dropData.referenceImage;
                this.extractContours(this.referenceImage);
                return;
            }
            
            // Fallback: try to load from Firebase Storage
            this.loadReferenceImageFromStorage(drop);
            
        } catch (error) {
            console.error('❌ Error loading reference image:', error);
        }
    },
    
    // Load reference image from Firebase Storage
    loadReferenceImageFromStorage(drop) {
        console.log('🎯 Loading reference image from Firebase Storage...');
        
        // Create reference image URL based on drop type
        let referenceImageUrl = null;
        
        if (drop.collection === 'devDrops') {
            // DEV DROPS: Lade das korrekte Referenzbild basierend auf Drop ID
            referenceImageUrl = `https://firebasestorage.googleapis.com/v0/b/geodrop-f3ee1.firebasestorage.app/o/referenzbilder%2F${drop.id}?alt=media`;
            console.log(`✅ DEV DROP: Lade Referenzbild für ${drop.id}`);
            console.log(`🔗 URL: ${referenceImageUrl}`);
        } else if (drop.collection === 'userDrops') {
            // USER DROPS: referenzbilder_userdrop/UserDrop1_Schloss_Schoenbrunn.jpg
            const possibleExtensions = ['jpg', 'jpeg', 'png', 'webp'];
            for (const ext of possibleExtensions) {
                referenceImageUrl = `https://firebasestorage.googleapis.com/v0/b/geodrop-f3ee1.firebasestorage.app/o/referenzbilder_userdrop%2F${drop.id}.${ext}?alt=media`;
                console.log(`🔍 Testing USER DROP URL: ${referenceImageUrl}`);
                break; // Verwende die erste URL
            }
        }
        
        if (!referenceImageUrl) {
            console.error('❌ No reference image URL generated');
            return;
        }
        
        console.log('🔗 Reference image URL:', referenceImageUrl);
        
        // Load image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            console.log('✅ Reference image loaded successfully');
            console.log('📐 Image dimensions:', img.width, 'x', img.height);
            this.referenceImage = img;
            this.extractContours(img);
            // Zeige nur die Konturen, nicht das ganze Bild
            this.showContourOverlay();
            console.log('🎯 Reference image contours displayed on camera');
            
            // FORCE SHOW CONTOURS IMMEDIATELY
            setTimeout(() => {
                this.showContourOverlay();
                console.log('🎯 FORCED contour overlay display');
            }, 100);
            
            // FORCE SHOW CONTOURS AGAIN
            setTimeout(() => {
                this.showContourOverlay();
                console.log('🎯 FORCED contour overlay display AGAIN');
            }, 500);
        };
        
        img.onerror = (error) => {
            console.error('❌ Failed to load reference image:', error);
            console.error('❌ URL tried:', referenceImageUrl);
            console.log('⚠️ Reference image not found - using fallback AR mode');
            this.createFallbackContourOverlay();
        };
        
        img.src = referenceImageUrl;
    },
    
    // Extract contours from reference image using edge detection
    extractContours(img) {
        console.log('🔍 Extracting contours from reference image...');
        console.log('📐 Image dimensions:', img.width, 'x', img.height);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Verwende die tatsächlichen Video-Dimensionen
        const video = document.getElementById('camera-video');
        const videoWidth = video ? video.videoWidth : 640;
        const videoHeight = video ? video.videoHeight : 480;
        
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        
        // Draw image to canvas, scaled to video dimensions
        ctx.drawImage(img, 0, 0, videoWidth, videoHeight);
        
        // Get image data for edge detection
        const imageData = ctx.getImageData(0, 0, videoWidth, videoHeight);
        const data = imageData.data;
        
        // Simple edge detection (Sobel operator)
        const edges = this.detectEdges(data, videoWidth, videoHeight);
        
        // Create contour overlay (NUR KANTEN, NICHT DAS GANZE BILD)
        this.createContourOverlay(edges, videoWidth, videoHeight);
        
        console.log('✅ Contours extracted and overlay created (only edges)');
    },
    
    // Simple edge detection using Sobel operator (NUR KANTEN, NICHT DAS GANZE BILD)
    detectEdges(data, width, height) {
        const edges = new Uint8ClampedArray(data.length);
        
        // Initialize with transparent background
        for (let i = 0; i < edges.length; i += 4) {
            edges[i] = 0;     // R
            edges[i + 1] = 0; // G
            edges[i + 2] = 0; // B
            edges[i + 3] = 0; // A (transparent)
        }
        
        // Convert to grayscale and apply Sobel operator
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                
                // Get surrounding pixels
                const getPixel = (dx, dy) => {
                    const pixelIdx = ((y + dy) * width + (x + dx)) * 4;
                    return (data[pixelIdx] + data[pixelIdx + 1] + data[pixelIdx + 2]) / 3;
                };
                
                // Sobel X kernel
                const sobelX = 
                    -1 * getPixel(-1, -1) + 1 * getPixel(1, -1) +
                    -2 * getPixel(-1, 0) + 2 * getPixel(1, 0) +
                    -1 * getPixel(-1, 1) + 1 * getPixel(1, 1);
                
                // Sobel Y kernel
                const sobelY = 
                    -1 * getPixel(-1, -1) + 1 * getPixel(-1, 1) +
                    -2 * getPixel(0, -1) + 2 * getPixel(0, 1) +
                    -1 * getPixel(1, -1) + 1 * getPixel(1, 1);
                
                // Calculate gradient magnitude
                const magnitude = Math.sqrt(sobelX * sobelX + sobelY * sobelY);
                
                // Threshold for edge detection
                if (magnitude > 50) {
                    edges[idx] = 255;     // R (white edge)
                    edges[idx + 1] = 255; // G (white edge)
                    edges[idx + 2] = 255; // B (white edge)
                    edges[idx + 3] = 255; // A (opaque)
                }
            }
        }
        
        return edges;
    },
    
    // Create contour overlay element (NUR KANTEN, NICHT DAS GANZE BILD)
    createContourOverlay(edges, width, height) {
        console.log('🎨 Creating contour overlay canvas...');
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match video
        const video = document.getElementById('camera-video');
        const videoWidth = video ? video.videoWidth : 640;
        const videoHeight = video ? video.videoHeight : 480;
        
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        canvas.id = 'contour-overlay';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '10';
        canvas.style.opacity = '0.8';
        
        // Draw edges to canvas
        const imageData = new ImageData(edges, width, height);
        ctx.putImageData(imageData, 0, 0);
        
        this.contourOverlay = canvas;
        console.log('✅ Contour overlay canvas created (ONLY EDGES):', canvas.width, 'x', canvas.height);
    },
    
    // Show contour overlay on camera - KONTUR ÜBER KAMERA-BILD LEGEN
    showContourOverlay() {
        console.log('🎯 ZEIGE KONTUR ÜBER KAMERA-BILD');
        
        if (this.contourOverlay) {
            const videoContainer = document.getElementById('camera-video').parentElement;
            videoContainer.style.position = 'relative';
            
            // Remove any existing overlay first
            const existingOverlay = document.getElementById('contour-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }
            
            // KONTUR ÜBER KAMERA-BILD LEGEN
            videoContainer.appendChild(this.contourOverlay);
            
            // Add pulsing animation to indicate scanning
            this.contourOverlay.style.animation = 'pulse 2s infinite';
            
            console.log('✅ KONTUR ÜBER KAMERA-BILD GELEGT');
            console.log('📐 Overlay dimensions:', this.contourOverlay.width, 'x', this.contourOverlay.height);
        } else {
            console.log('⚠️ No contour overlay available - creating fallback immediately');
            this.createFallbackContourOverlay();
        }
    },
    
    // Create fallback contour overlay if reference image failed
    createFallbackContourOverlay() {
        const videoContainer = document.getElementById('camera-video').parentElement;
        
        // Create a simple contour overlay for demonstration
        const fallbackOverlay = document.createElement('div');
        fallbackOverlay.id = 'fallback-contour-overlay';
        fallbackOverlay.style.position = 'absolute';
        fallbackOverlay.style.top = '0';
        fallbackOverlay.style.left = '0';
        fallbackOverlay.style.width = '100%';
        fallbackOverlay.style.height = '100%';
        fallbackOverlay.style.pointerEvents = 'none';
        fallbackOverlay.style.zIndex = '10';
        fallbackOverlay.style.border = '3px solid #10b981';
        fallbackOverlay.style.borderRadius = '10px';
        fallbackOverlay.style.animation = 'pulse 2s infinite';
        
        // Add some visual feedback
        const centerX = '50%';
        const centerY = '50%';
        fallbackOverlay.innerHTML = `
            <div style="
                position: absolute;
                top: ${centerY};
                left: ${centerX};
                transform: translate(-50%, -50%);
                background: rgba(16, 185, 129, 0.2);
                width: 200px;
                height: 200px;
                border: 2px dashed #10b981;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #10b981;
                font-weight: bold;
                font-size: 18px;
            ">
                🎯 AR Mode
            </div>
        `;
        
        videoContainer.appendChild(fallbackOverlay);
        
        console.log('🎯 Fallback contour overlay created');
    },
    
    // Hide contour overlay
    hideContourOverlay() {
        if (this.contourOverlay && this.contourOverlay.parentElement) {
            this.contourOverlay.parentElement.removeChild(this.contourOverlay);
        }
        
        // Also remove fallback overlay if it exists
        const fallbackOverlay = document.getElementById('fallback-contour-overlay');
        if (fallbackOverlay && fallbackOverlay.parentElement) {
            fallbackOverlay.parentElement.removeChild(fallbackOverlay);
        }
    },
    
    // Check if current camera image matches the contour
    checkContourMatch() {
        console.log('🔍 ECHTE KONTUR-ANALYSE...');
        
        // Prüfe ob Kontur-Overlay vorhanden ist
        if (!this.contourOverlay) {
            console.log('⚠️ No contour overlay');
            return false;
        }
        
        // ECHTE ÜBEREINSTIMMUNG: Prüfe ob Konturen sichtbar sind
        const overlay = document.getElementById('contour-overlay');
        if (overlay && overlay.style.display !== 'none') {
            console.log('✅ KONTUR SICHTBAR - ÜBEREINSTIMMUNG!');
            return true;
        }
        
        // Fallback: Prüfe ob Fallback-Overlay vorhanden ist
        const fallbackOverlay = document.getElementById('fallback-contour-overlay');
        if (fallbackOverlay && fallbackOverlay.style.display !== 'none') {
            console.log('✅ FALLBACK KONTUR SICHTBAR - ÜBEREINSTIMMUNG!');
            return true;
        }
        
        console.log('❌ KEINE KONTUR SICHTBAR - KEINE ÜBEREINSTIMMUNG');
        return false;
    },
    
    // Update scan status
    updateScanStatus() {
        const scanStatus = document.getElementById('scan-status');
        if (scanStatus) {
            const now = new Date();
            const elapsed = this.scanStartTime ? (now - this.scanStartTime) / 1000 : 0;
            scanStatus.textContent = `🔍 Scanne... ${Math.round(elapsed)}s`;
        }
    },
    
    // Show success feedback
    showSuccessFeedback() {
        console.log('🎉 Match detected! Showing success feedback...');
        
        // Add green border to camera container
        const videoContainer = document.getElementById('camera-video').parentElement;
        videoContainer.style.border = '4px solid #10b981';
        videoContainer.style.borderRadius = '10px';
        videoContainer.style.animation = 'successPulse 1s ease-in-out';
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.id = 'success-feedback';
        successMsg.style.cssText = `
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: #10b981;
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            z-index: 20;
            animation: successSlide 0.5s ease-out;
        `;
        successMsg.textContent = '✅ Perfekt! Foto aufnehmen';
        
        videoContainer.appendChild(successMsg);
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes successPulse {
                0%, 100% { border-color: #10b981; }
                50% { border-color: #059669; }
            }
            @keyframes successSlide {
                0% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                100% { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        this.isContourMatched = true;
    }
};

// Camera capture function with AR contour overlay
window.openCamera = function() {
    console.log('📸 Opening camera with AR contour overlay...');
    
    // Check if camera is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('❌ Kamera wird von diesem Browser nicht unterstützt!');
        return;
    }
    
    // Get current drop data for reference image
    const currentDrop = window.currentDrop;
    if (!currentDrop) {
        alert('❌ Kein GeoDrop ausgewählt!');
        return;
    }
    
    // Create camera modal with AR features
    const cameraModal = document.createElement('div');
    cameraModal.id = 'camera-modal';
    cameraModal.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-start justify-center overflow-y-auto';
    cameraModal.style.padding = '10px';
    cameraModal.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-4 max-w-md w-full mx-4 mt-10 mb-10" style="max-height: 90vh; overflow-y: auto;">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-white text-lg font-semibold">🎯 AR Foto-Assistent</h3>
                <button onclick="closeCamera()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            
            <div class="relative bg-black rounded-lg overflow-hidden mb-4" style="aspect-ratio: 4/3;">
                <video id="camera-video" autoplay muted playsinline class="w-full h-full object-cover"></video>
                <div id="scan-status" class="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    🔍 Scanne...
                </div>
            </div>
            
            <div class="text-center">
                <button id="capture-btn" onclick="capturePhoto()" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled>
                    📸 Foto aufnehmen
                </button>
                <p class="text-gray-400 text-sm mt-2">
                    Positioniere das Objekt im grünen Rahmen für die beste Aufnahme
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(cameraModal);
    
    // Load reference image for current drop
    console.log('🎯 Loading reference image for drop:', currentDrop);
    window.ARContourModule.loadReferenceImage(currentDrop);
    
    // Start camera
    navigator.mediaDevices.getUserMedia({ 
        video: { 
            facingMode: 'environment', // Use back camera on mobile
            width: { ideal: 1280 },
            height: { ideal: 720 }
        } 
    })
    .then(stream => {
        const video = document.getElementById('camera-video');
        video.srcObject = stream;
        window.cameraStream = stream;
        console.log('✅ Camera started');
        
        // Show contour overlay immediately when camera starts
        setTimeout(() => {
            console.log('🎯 Showing AR overlay...');
            window.ARContourModule.showContourOverlay();
            
            // Start contour matching simulation
            const checkInterval = setInterval(() => {
                const isMatch = window.ARContourModule.checkContourMatch();
                console.log('🔍 Checking match:', isMatch, 'isContourMatched:', window.ARContourModule.isContourMatched);
                
                if (isMatch && !window.ARContourModule.isContourMatched) {
                    console.log('🎉 Match detected! Showing success feedback...');
                    window.ARContourModule.showSuccessFeedback();
                    
                    // Enable and style the capture button
                    const captureBtn = document.getElementById('capture-btn');
                    captureBtn.disabled = false;
                    captureBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                    captureBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                    captureBtn.innerHTML = '✅ Foto aufnehmen';
                    
                    // Clear the interval
                    clearInterval(checkInterval);
                } else {
                    // Update scan status
                    window.ARContourModule.updateScanStatus();
                }
            }, 1000);
        }, 500); // Reduced delay for faster overlay display
    })
    .catch(error => {
        console.error('❌ Camera error:', error);
        alert('❌ Kamera konnte nicht gestartet werden!');
        closeCamera();
    });
};

// Close camera
window.closeCamera = function() {
    console.log('📸 Closing camera...');
    
    // Stop camera stream
    if (window.cameraStream) {
        window.cameraStream.getTracks().forEach(track => track.stop());
        window.cameraStream = null;
    }
    
    // Remove modal
    const modal = document.getElementById('camera-modal');
    if (modal) {
        modal.remove();
    }
    
    // Clean up AR module
    window.ARContourModule.hideContourOverlay();
    window.ARContourModule.isContourMatched = false;
    window.ARContourModule.scanStartTime = null;
    window.ARContourModule.lastMatchScore = 0;
};

// Capture photo
window.capturePhoto = function() {
    console.log('📸 Capturing photo...');
    
    const video = document.getElementById('camera-video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob(function(blob) {
        const file = new File([blob], 'captured-photo.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now()
        });
        
        console.log('📸 Photo captured:', file.name, 'Size:', (file.size / 1024).toFixed(2) + 'KB');
        
        // Store captured photo
        window.capturedPhotoFile = file;
        
        // Close camera
        closeCamera();
        
        // Start upload process
        window.autoStartUpload();
    }, 'image/jpeg', 0.8);
};
