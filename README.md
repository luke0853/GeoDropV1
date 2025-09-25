# 🌍 GeoDrop V1

**A blockchain-based geocaching application with dual-language support and advanced photo validation.**

GeoDrop V1 is an innovative geocaching platform that combines traditional treasure hunting with modern blockchain technology and AI-powered photo validation. Players can discover, create, and claim GeoDrops worldwide while earning cryptocurrency rewards.

## ✨ Key Features

### 🗺️ **Interactive Mapping System**
- **Real-time GPS tracking** with Leaflet Maps integration
- **Multiple drop types**: Dev Drops, User Drops, and Normal GeoDrops
- **Visual legend** with different icons for each drop type
- **Location-based discovery** with radius-based drop visibility
- **Mobile-responsive design** for seamless mobile experience

### 📸 **Advanced Photo Validation**
- **AWS Rekognition integration** for automatic photo verification
- **Duplicate detection** to prevent fake submissions
- **Image quality assessment** with confidence scoring
- **Secure hash-based validation** for drop authenticity
- **Real-time photo processing** with instant feedback

### 🌐 **Dual-Language Support**
- **Complete German/English translation** system
- **Dynamic language switching** without page reload
- **Localized UI elements** including map legend and forms
- **Cultural adaptation** for different regions
- **RTL support ready** for future expansion

### 🔐 **Developer Tools & Admin Panel**
- **Dev Tab** with comprehensive debugging tools
- **Drop management system** for creating and deleting drops
- **User drop creation** with detailed metadata
- **Pool wallet integration** for cryptocurrency management
- **Real-time statistics** and analytics dashboard

### 💰 **Blockchain Integration**
- **PixelDrop cryptocurrency** rewards system
- **Smart contract integration** for secure transactions
- **Pool wallet management** with balance tracking
- **Transaction history** and reward distribution
- **Cross-platform compatibility** with Web3 wallets

## 🛠️ Technology Stack

### **Frontend**
- **HTML5, CSS3, JavaScript (ES6+)**
- **Tailwind CSS** for responsive design
- **Leaflet Maps** for interactive mapping
- **Progressive Web App (PWA)** capabilities

### **Backend & Services**
- **Firebase Authentication** for user management
- **Cloud Firestore** for real-time database
- **Firebase Storage** for image hosting
- **AWS Rekognition** for AI photo validation
- **Firebase Hosting** for global CDN

### **Blockchain & Crypto**
- **Ethereum-compatible** smart contracts
- **Web3 integration** for wallet connectivity
- **PixelDrop token** (ERC-20 standard)
- **BNB Smart Chain** compatibility

### **Development Tools**
- **Git version control** with detailed commit history
- **Firebase CLI** for deployment automation
- **ESLint** for code quality
- **Chrome DevTools** integration

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js (v14 or higher)
- Firebase CLI
- AWS Account (for Rekognition)
- Git

### **Quick Start**
```bash
# 1. Clone the repository
git clone https://github.com/luke0853/GeoDropV1.git
cd GeoDropV1

# 2. Install dependencies (if using npm)
npm install

# 3. Configure Firebase
firebase login
firebase use geodrop-f3ee1

# 4. Configure AWS credentials
# Add your AWS credentials to config/config-secrets.js

# 5. Start development server
npm start
# OR simply open index.html in your browser
```

### **Environment Configuration**
1. **Firebase Setup**: Configure `config/config-secure.js` with your Firebase project details
2. **AWS Setup**: Add Rekognition credentials to `config/config-secrets.js`
3. **Blockchain Setup**: Configure wallet addresses in the config files

## 📱 Usage Guide

### **For Players**
1. **Register/Login** using Firebase Authentication
2. **Enable GPS** to see your location on the map
3. **Discover GeoDrops** by exploring the interactive map
4. **Take photos** at drop locations for validation
5. **Claim rewards** in PixelDrop cryptocurrency

### **For Developers**
1. **Access Dev Tab** with admin credentials
2. **Create test drops** using the upload system
3. **Monitor statistics** in the admin dashboard
4. **Debug issues** using built-in debugging tools
5. **Manage user drops** and moderation

## 🔧 Recent Updates (Latest Commit: b97ff7a)

### **Dev Tab Improvements**
- ✅ Fixed User Drops not showing in Dev Tab dropdown
- ✅ Added `loadUserDropsForUpload()` and `loadDevDropsForUpload()` functions
- ✅ Implemented `switchToUploadListType()` for seamless switching
- ✅ Fixed dropdown flickering with conditional updates
- ✅ Added comprehensive debugging tools

### **Internationalization**
- ✅ Complete map legend translation (German/English)
- ✅ Added `data-translate` attributes to all UI elements
- ✅ Dynamic language switching for all components
- ✅ Cultural localization for different regions

### **User Experience**
- ✅ Improved mobile responsiveness
- ✅ Enhanced error handling and user feedback
- ✅ Real-time validation feedback
- ✅ Optimized loading performance

## 🌐 Live Demo

**Production URL**: https://geodrop-f3ee1.web.app

**Firebase Console**: https://console.firebase.google.com/project/geodrop-f3ee1/overview

## 📊 Project Statistics

- **Total Files**: 660+ files
- **Languages**: JavaScript, HTML, CSS
- **Database**: Cloud Firestore with real-time sync
- **Storage**: Firebase Storage with CDN
- **Maps**: Leaflet with custom markers
- **AI**: AWS Rekognition integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/luke0853/GeoDropV1/issues)
- **Documentation**: Check the `/docs` folder
- **Contact**: [GitHub Profile](https://github.com/luke0853)

## 🎯 Roadmap

- [ ] **Mobile App** (React Native)
- [ ] **Additional Languages** (Spanish, French)
- [ ] **Social Features** (Friends, Teams)
- [ ] **Advanced Analytics** (Heatmaps, Statistics)
- [ ] **NFT Integration** (Unique drop collectibles)
- [ ] **AR Features** (Augmented Reality drops)

---

**Made with ❤️ by the GeoDrop Team**
