const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Google Places API Search
exports.placesSearch = functions.https.onRequest(async (req, res) => {
    const { query } = req.query;
    const API_KEY = 'AIzaSyBpgwy7LK_MhxhS4DeD5Sv8aeZF_dJHbew';
    
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`);
        const data = await response.json();
        
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.json(data);
    } catch (error) {
        console.error('Places Search Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Google Places API Details
exports.placesDetails = functions.https.onRequest(async (req, res) => {
    const { placeId } = req.params;
    const API_KEY = 'AIzaSyBpgwy7LK_MhxhS4DeD5Sv8aeZF_dJHbew';
    
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`);
        const data = await response.json();
        
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.json(data);
    } catch (error) {
        console.error('Places Details Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Google Places API Photo
exports.placesPhoto = functions.https.onRequest(async (req, res) => {
    const { photo_reference, maxwidth } = req.query;
    const API_KEY = 'AIzaSyBpgwy7LK_MhxhS4DeD5Sv8aeZF_dJHbew';
    
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photo_reference}&maxwidth=${maxwidth}&key=${API_KEY}`);
        const imageBuffer = await response.buffer();
        
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Content-Type', 'image/jpeg');
        res.send(imageBuffer);
    } catch (error) {
        console.error('Places Photo Error:', error);
        res.status(500).json({ error: error.message });
    }
});