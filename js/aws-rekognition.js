// AWS Rekognition Service for GeoDrop Image Validation
// This service handles image validation using AWS Rekognition

class AWSRekognitionService {
    constructor() {
        this.config = window.AWS_CONFIG || {};
        this.isInitialized = false;
        this.usageStats = {
            imagesProcessed: 0,
            labelsDetected: 0,
            facesDetected: 0,
            compareFacesUsed: 0
        };
    }

    // Initialize AWS Rekognition
    async initialize() {
        try {
            console.log('🔧 Initializing AWS Rekognition...');
            
            // Check if AWS SDK is loaded
            if (typeof AWS === 'undefined') {
                throw new Error('AWS SDK not loaded. Please include AWS SDK in your HTML.');
            }

            // Configure AWS
            AWS.config.update({
                region: this.config.region || 'eu-central-1',
                credentials: new AWS.Credentials({
                    accessKeyId: this.getAccessKeyId(),
                    secretAccessKey: this.getSecretAccessKey()
                })
            });

            // Create Rekognition instance
            this.rekognition = new AWS.Rekognition({
                apiVersion: this.config.rekognition?.apiVersion || '2016-06-27',
                region: this.config.region || 'eu-central-1'
            });

            this.isInitialized = true;
            console.log('✅ AWS Rekognition initialized successfully');
            return true;

        } catch (error) {
            console.error('❌ Failed to initialize AWS Rekognition:', error);
            this.isInitialized = false;
            return false;
        }
    }

    // Get AWS credentials from config
    getAccessKeyId() {
        // Try multiple sources for AWS credentials
        if (window.CONFIG?.aws?.accessKeyId) {
            return window.CONFIG.aws.accessKeyId;
        }
        
        // Fallback: try direct access to secrets
        if (window.SECRETS?.aws?.accessKeyId) {
            return window.SECRETS.aws.accessKeyId;
        }
        
        throw new Error('AWS Access Key ID not found in configuration');
    }

    getSecretAccessKey() {
        // Try multiple sources for AWS credentials
        if (window.CONFIG?.aws?.secretAccessKey) {
            return window.CONFIG.aws.secretAccessKey;
        }
        
        // Fallback: try direct access to secrets
        if (window.SECRETS?.aws?.secretAccessKey) {
            return window.SECRETS.aws.secretAccessKey;
        }
        
        throw new Error('AWS Secret Access Key not found in configuration');
    }

    // Validate image using AWS Rekognition
    async validateImage(imageFile, referenceImage = null) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        if (!this.isInitialized) {
            throw new Error('AWS Rekognition not initialized');
        }

        try {
            console.log('🔍 Validating image with AWS Rekognition...');
            
            // Check file format first
            if (!this.config.validation.supportedFormats.includes(imageFile.type)) {
                throw new Error(`Unsupported file format: ${imageFile.type}. Supported formats: ${this.config.validation.supportedFormats.join(', ')}`);
            }
            
            // Check file size
            if (imageFile.size > this.config.validation.maxFileSize) {
                throw new Error(`File too large: ${(imageFile.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: ${(this.config.validation.maxFileSize / 1024 / 1024).toFixed(2)}MB`);
            }
            
            // Check usage limits
            if (this.usageStats.imagesProcessed >= this.config.rekognition.limits.maxImages) {
                throw new Error('Monthly image limit reached. Please try again next month.');
            }

            // Convert image to base64
            const imageBytes = await this.fileToBase64(imageFile);
            
            // Run object detection only (no face detection for landscapes/buildings)
            const objectResult = await this.detectObjects(imageBytes);
            const compareResult = referenceImage ? await this.compareImages(imageBytes, referenceImage) : null;

            // Analyze results (no face detection)
            const validation = this.analyzeResults(null, objectResult, compareResult);
            
            // Update usage stats
            this.usageStats.imagesProcessed++;
            this.usageStats.labelsDetected += objectResult.labels?.length || 0;
            // No face detection for landscapes/buildings
            if (compareResult) this.usageStats.compareFacesUsed++;

            console.log('✅ Image validation completed:', validation);
            return validation;

        } catch (error) {
            console.error('❌ Image validation failed:', error);
            return {
                valid: false,
                error: error.message,
                confidence: 0
            };
        }
    }

    // Detect faces in image - DISABLED for GeoDrops (landscapes/buildings only)
    async detectFaces(imageBytes) {
        // Face detection disabled for GeoDrops - we only want landscapes/buildings
        console.log('🚫 Face detection disabled for GeoDrops');
        return { faces: [] };
    }

    // Detect objects in image
    async detectObjects(imageBytes) {
        if (!this.config.objectDetection?.enabled) {
            return { labels: [] };
        }

        try {
            // Try with normal confidence first
            let params = {
                Image: { Bytes: imageBytes },
                MaxLabels: this.config.objectDetection.maxLabels || 10,
                MinConfidence: this.config.objectDetection.minConfidence || 60
            };

            let result = await this.rekognition.detectLabels(params).promise();
            
            // If no objects found, try with lower confidence for dark images
            if (!result.Labels || result.Labels.length === 0) {
                console.log('🔍 No objects with normal confidence, trying lower confidence for dark images...');
                params.MinConfidence = 20; // Much lower confidence for dark images
                result = await this.rekognition.detectLabels(params).promise();
            }
            
            console.log('🏷️ Object detection result:', result);
            return result;

        } catch (error) {
            console.error('❌ Object detection failed:', error);
            return { labels: [] };
        }
    }

    // Compare two images
    async compareImages(imageBytes1, imageBytes2) {
        try {
            const params = {
                SourceImage: { Bytes: imageBytes1 },
                TargetImage: { Bytes: imageBytes2 },
                SimilarityThreshold: 70
            };

            const result = await this.rekognition.compareFaces(params).promise();
            console.log('🔄 Image comparison result:', result);
            return result;

        } catch (error) {
            console.error('❌ Image comparison failed:', error);
            return null;
        }
    }

    // Analyze validation results
    analyzeResults(faceResult, objectResult, compareResult) {
        const validation = {
            valid: false, // Start with false - must prove it's valid
            confidence: 0,
            reasons: [],
            detectedObjects: [],
            faceDetected: false
        };

        // Skip face detection for landscapes/buildings
        // No face checking needed for GeoDrops

        // Check detected objects
        if (objectResult.labels && objectResult.labels.length > 0) {
            validation.detectedObjects = objectResult.labels.map(label => ({
                name: label.Name,
                confidence: label.Confidence
            }));

            // Check for suspicious objects
            const suspiciousObjects = ['Person', 'Human', 'Face', 'Hand', 'Finger'];
            const hasSuspiciousObjects = validation.detectedObjects.some(obj => 
                suspiciousObjects.includes(obj.name) && obj.confidence > 70
            );

            if (hasSuspiciousObjects) {
                validation.valid = false;
                validation.reasons.push('Person oder Körperteil erkannt - bitte fotografiere das Objekt');
                validation.confidence = 0;
            } else {
                // Calculate confidence based on object detection
                const avgConfidence = validation.detectedObjects.reduce((sum, obj) => sum + obj.confidence, 0) / validation.detectedObjects.length;
                validation.confidence = Math.min(avgConfidence, 100);
                validation.valid = true; // Mark as valid if no suspicious objects
            }
        } else {
            // For dark images or images with no clear objects, be more lenient
            console.log('🔍 No objects detected - checking if image might be valid despite this...');
            
            // Check if this might be a valid dark image (like a black object, night scene, etc.)
            // For now, we'll allow it but with lower confidence
            validation.valid = true;
            validation.reasons.push('Wenige Objekte erkannt - Bild wird trotzdem akzeptiert');
            validation.confidence = 30; // Lower confidence but still valid
        }

        // Check image comparison if reference image provided
        if (compareResult && compareResult.FaceMatches && compareResult.FaceMatches.length > 0) {
            validation.valid = false;
            validation.reasons.push('Bild entspricht nicht dem Referenzbild');
            validation.confidence = 0;
        }

        return validation;
    }

    // Convert file to base64
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                const binary = atob(base64);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) {
                    bytes[i] = binary.charCodeAt(i);
                }
                resolve(bytes);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Get usage statistics
    getUsageStats() {
        return {
            ...this.usageStats,
            limits: this.config.rekognition.limits,
            remaining: {
                images: this.config.rekognition.limits.maxImages - this.usageStats.imagesProcessed,
                labels: this.config.rekognition.limits.maxLabels - this.usageStats.labelsDetected,
                faces: this.config.rekognition.limits.maxFaces - this.usageStats.facesDetected
            }
        };
    }

    // AWS-based secure drop counting
    async getSecureDropCount() {
        try {
            console.log('🔒 Getting secure drop count from AWS...');
            
            // For now, use the real Firebase count as the "secure" count
            // In a real implementation, this would be validated by AWS
            const realCount = await this.getRealDevDropsCount();
            
            console.log(`🔒 Secure drop count (from Firebase): ${realCount}`);
            return realCount;
            
        } catch (error) {
            console.error('❌ Failed to get secure drop count:', error);
            // Fallback to local count if AWS fails
            return await this.getFallbackCount();
        }
    }

    // Calculate secure count using AWS services
    async calculateSecureCount(requestId) {
        try {
            // This would typically call an AWS Lambda function or DynamoDB
            // For now, we'll simulate a secure calculation
            
            // Get current timestamp for uniqueness
            const timestamp = Date.now();
            
            // Create a secure hash of the request
            const requestHash = await this.createSecureHash(requestId + timestamp);
            
            // Use the hash to determine the count (this is just an example)
            // In a real implementation, this would query a secure AWS database
            const baseCount = 8; // This would come from AWS DynamoDB
            // NO hash modifier - use exact count!
            const secureCount = baseCount;
            
            console.log(`🔒 Secure calculation: base=${baseCount}, hash=${requestHash.substr(0, 8)}, result=${secureCount}`);
            
            return secureCount;
            
        } catch (error) {
            console.error('❌ Secure count calculation failed:', error);
            throw error;
        }
    }

    // Create secure hash for validation
    async createSecureHash(input) {
        try {
            // Use Web Crypto API for secure hashing
            const encoder = new TextEncoder();
            const data = encoder.encode(input);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        } catch (error) {
            console.error('❌ Hash creation failed:', error);
            // Fallback to simple hash
            return input.split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0).toString(16);
        }
    }

    // Fallback count if AWS fails
    async getFallbackCount() {
        try {
            // This would be the local Firebase count as fallback
            if (window.db) {
                const devDropsSnapshot = await window.db.collection('devDrops').get();
                return devDropsSnapshot.size;
            }
            return 0;
        } catch (error) {
            console.error('❌ Fallback count failed:', error);
            return 0;
        }
    }

    // Get real Firebase count for AWS validation
    async getRealDevDropsCount() {
        try {
            if (!window.db) {
                return 0;
            }
            
            const devDropsSnapshot = await window.db.collection('devDrops').get();
            
            // Count only real GeoDrops (starting with "GeoDrop"), not pattern drops like "devDrop1"
            let realGeoDropsCount = 0;
            devDropsSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.name && data.name.startsWith('GeoDrop')) {
                    realGeoDropsCount++;
                }
            });
            
            console.log(`🔒 AWS real count: ${devDropsSnapshot.size} total, ${realGeoDropsCount} real GeoDrops`);
            return realGeoDropsCount;
        } catch (error) {
            console.error('❌ Error getting real dev drops count:', error);
            return 0;
        }
    }

    // Create image hash for AWS-based identification
    async createImageHash(imageFile) {
        try {
            console.log('🔍 Creating AWS image hash...');
            
            // Convert image to base64
            const imageBytes = await this.fileToBase64(imageFile);
            
            // Create hash from image bytes
            const imageHash = await this.createSecureHash(imageBytes.toString());
            
            // Also get image metadata for additional identification
            const imageMetadata = {
                size: imageFile.size,
                type: imageFile.type,
                lastModified: imageFile.lastModified,
                name: imageFile.name
            };
            
            const fullHash = await this.createSecureHash(imageHash + JSON.stringify(imageMetadata));
            
            console.log(`🔍 Image hash created: ${fullHash.substr(0, 16)}...`);
            return fullHash;
            
        } catch (error) {
            console.error('❌ Image hash creation failed:', error);
            throw error;
        }
    }

    // Migrate old dev drops to AWS method
    async migrateOldDevDrops() {
        try {
            console.log('🔄 Starting migration of old dev drops to AWS method...');
            
            if (!window.db) {
                throw new Error('Firebase not available');
            }
            
            // Get all existing dev drops
            const devDropsSnapshot = await window.db.collection('devDrops').get();
            console.log(`📊 Found ${devDropsSnapshot.size} dev drops to migrate`);
            
            let migrated = 0;
            let errors = 0;
            
            for (const doc of devDropsSnapshot.docs) {
                try {
                    const dropData = doc.data();
                    console.log(`🔄 Migrating drop: ${dropData.name || doc.id}`);
                    
                    // Check if already migrated (has AWS hash)
                    if (dropData.awsImageHash) {
                        console.log(`⏭️ Drop ${dropData.name} already migrated, skipping`);
                        continue;
                    }
                    
                    // If drop has imageUrl, analyze it
                    if (dropData.imageUrl) {
                        // Create new AWS hash for existing image
                        const newHash = await this.createImageHashFromUrl(dropData.imageUrl);
                        
                        // Update drop with AWS data
                        await window.db.collection('devDrops').doc(doc.id).update({
                            awsImageHash: newHash,
                            awsMigrated: true,
                            awsMigrationDate: new Date(),
                            oldHashMethod: 'legacy', // Mark as old method
                            newHashMethod: 'aws-rekognition'
                        });
                        
                        migrated++;
                        console.log(`✅ Migrated drop: ${dropData.name} with hash: ${newHash.substr(0, 16)}...`);
                        
                    } else {
                        // Drop without image - mark as migrated but no hash
                        await window.db.collection('devDrops').doc(doc.id).update({
                            awsMigrated: true,
                            awsMigrationDate: new Date(),
                            oldHashMethod: 'legacy',
                            newHashMethod: 'aws-rekognition',
                            noImage: true
                        });
                        
                        migrated++;
                        console.log(`✅ Migrated drop without image: ${dropData.name}`);
                    }
                    
                } catch (error) {
                    console.error(`❌ Failed to migrate drop ${doc.id}:`, error);
                    errors++;
                }
            }
            
            console.log(`🎯 Migration completed: ${migrated} migrated, ${errors} errors`);
            return { migrated, errors, total: devDropsSnapshot.size };
            
        } catch (error) {
            console.error('❌ Migration failed:', error);
            throw error;
        }
    }

    // Create hash from existing image URL
    async createImageHashFromUrl(imageUrl) {
        try {
            // Fetch image from URL
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            
            // Convert blob to array buffer
            const arrayBuffer = await blob.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            
            // Create hash from bytes
            const imageHash = await this.createSecureHash(bytes.toString());
            
            return imageHash;
            
        } catch (error) {
            console.error('❌ Failed to create hash from URL:', error);
            // Fallback: create hash from URL itself
            return await this.createSecureHash(imageUrl);
        }
    }

    // Validate drop creation with AWS
    async validateDropCreation(imageFile, dropData) {
        try {
            console.log('🔒 Validating drop creation with AWS...');
            
            // First validate the image
            const imageValidation = await this.validateImage(imageFile);
            
            if (!imageValidation.valid) {
                return {
                    valid: false,
                    error: imageValidation.reasons.join(', '),
                    confidence: imageValidation.confidence
                };
            }
            
            // Create AWS image hash
            const imageHash = await this.createImageHash(imageFile);
            
            // Get secure count
            const secureCount = await this.getSecureDropCount();
            
            // Validate the drop number
            const expectedNumber = secureCount + 1;
            const providedNumber = parseInt(dropData.name.replace('GeoDrop', ''));
            
            if (providedNumber !== expectedNumber) {
                return {
                    valid: false,
                    error: `Ungültige Drop-Nummer. Erwartet: ${expectedNumber}, Erhalten: ${providedNumber}`,
                    confidence: 0
                };
            }
            
            // All validations passed
            return {
                valid: true,
                confidence: imageValidation.confidence,
                secureCount: secureCount,
                nextNumber: expectedNumber,
                imageHash: imageHash
            };
            
        } catch (error) {
            console.error('❌ Drop creation validation failed:', error);
            return {
                valid: false,
                error: 'AWS-Validierung fehlgeschlagen',
                confidence: 0
            };
        }
    }
}

// Create global instance
window.awsRekognitionService = new AWSRekognitionService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AWSRekognitionService;
}