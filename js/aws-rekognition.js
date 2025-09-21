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

    // Get AWS credentials (you need to set these)
    getAccessKeyId() {
        // SECURITY FIX: Use config instead of hardcoded key
        return window.CONFIG?.aws?.accessKeyId || 'MISSING_AWS_ACCESS_KEY';
    }

    getSecretAccessKey() {
        // SECURITY FIX: Use config instead of hardcoded key
        return window.CONFIG?.aws?.secretAccessKey || 'MISSING_AWS_SECRET_KEY';
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
            
            // Check usage limits
            if (this.usageStats.imagesProcessed >= this.config.rekognition.limits.maxImages) {
                throw new Error('Monthly image limit reached. Please try again next month.');
            }

            // Convert image to base64
            const imageBytes = await this.fileToBase64(imageFile);
            
            // Run multiple validations
            const results = await Promise.all([
                this.detectFaces(imageBytes),
                this.detectObjects(imageBytes),
                referenceImage ? this.compareImages(imageBytes, referenceImage) : null
            ]);

            const [faceResult, objectResult, compareResult] = results;

            // Analyze results
            const validation = this.analyzeResults(faceResult, objectResult, compareResult);
            
            // Update usage stats
            this.usageStats.imagesProcessed++;
            this.usageStats.labelsDetected += objectResult.labels?.length || 0;
            this.usageStats.facesDetected += faceResult.faces?.length || 0;
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

    // Detect faces in image
    async detectFaces(imageBytes) {
        if (!this.config.faceDetection?.enabled) {
            return { faces: [] };
        }

        try {
            const params = {
                Image: { Bytes: imageBytes },
                Attributes: this.config.faceDetection.attributes || ['ALL'],
                MaxFaces: this.config.faceDetection.maxFaces || 1
            };

            const result = await this.rekognition.detectFaces(params).promise();
            console.log('👤 Face detection result:', result);
            return result;

        } catch (error) {
            console.error('❌ Face detection failed:', error);
            return { faces: [] };
        }
    }

    // Detect objects in image
    async detectObjects(imageBytes) {
        if (!this.config.objectDetection?.enabled) {
            return { labels: [] };
        }

        try {
            const params = {
                Image: { Bytes: imageBytes },
                MaxLabels: this.config.objectDetection.maxLabels || 10,
                MinConfidence: this.config.objectDetection.minConfidence || 60
            };

            const result = await this.rekognition.detectLabels(params).promise();
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
            valid: true,
            confidence: 0,
            reasons: [],
            detectedObjects: [],
            faceDetected: false
        };

        // Check for faces (hand-over-face detection)
        if (faceResult.faces && faceResult.faces.length > 0) {
            validation.faceDetected = true;
            validation.valid = false;
            validation.reasons.push('Gesicht erkannt - bitte fotografiere das Objekt, nicht dich selbst');
            validation.confidence = 0;
        }

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
            }
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
}

// Create global instance
window.awsRekognitionService = new AWSRekognitionService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AWSRekognitionService;
}
