// AWS Rekognition Configuration for GeoDrop
// This file contains the AWS configuration for image validation

const AWS_CONFIG = {
    // AWS Region (change to your preferred region)
    region: 'eu-central-1', // Frankfurt, Germany
    
    // AWS Rekognition Service
    rekognition: {
        // Service endpoint
        endpoint: 'https://rekognition.eu-central-1.amazonaws.com',
        
        // API Version
        apiVersion: '2016-06-27',
        
        // Free tier limits (per month)
        limits: {
            maxImages: 5000,        // 5,000 images per month free
            maxLabels: 5000,        // 5,000 labels per month free
            maxFaces: 5000,         // 5,000 face detections per month free
            maxCompareFaces: 1000   // 1,000 face comparisons per month free
        }
    },
    
    // Image validation settings
    validation: {
        // Minimum confidence for object detection
        minConfidence: 80,          // 80% confidence required
        
        // Maximum file size (5MB)
        maxFileSize: 5 * 1024 * 1024,
        
        // Supported image formats
        supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
        
        // Image dimensions
        minWidth: 400,
        minHeight: 400,
        maxWidth: 4096,
        maxHeight: 4096
    },
    
    // Face detection settings (to detect hand-over-face scenarios)
    faceDetection: {
        enabled: true,
        minConfidence: 70,          // 70% confidence for face detection
        maxFaces: 1,                // Allow max 1 face (no hand-over-face)
        attributes: ['ALL']         // Detect all face attributes
    },
    
    // Object detection settings
    objectDetection: {
        enabled: true,
        minConfidence: 60,          // 60% confidence for object detection
        maxLabels: 10,              // Max 10 labels per image
        minInstances: 1             // Min 1 instance per label
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AWS_CONFIG;
} else {
    window.AWS_CONFIG = AWS_CONFIG;
    
    // Also integrate into main CONFIG if available
    if (window.CONFIG) {
        window.CONFIG.aws = AWS_CONFIG;
    }
}