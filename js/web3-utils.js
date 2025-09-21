// Web3 Utilities - Helper Functions
// Extracted from backup to keep index.html clean

// Utility functions for Web3 operations

// Format address (shorten for display)
function formatAddress(address, startChars = 6, endChars = 4) {
    if (!address) return '';
    if (address.length <= startChars + endChars) return address;
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

// Format balance (convert wei to readable format)
function formatBalance(balance, decimals = 6) {
    if (!balance) return '0.000000';
    const num = parseFloat(balance);
    return num.toFixed(decimals);
}

// Format large numbers (K, M, B)
function formatLargeNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Validate Ethereum address
function isValidAddress(address) {
    if (!address) return false;
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Validate transaction hash
function isValidTxHash(hash) {
    if (!hash) return false;
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

// Convert wei to ether
function weiToEther(wei) {
    if (!wei) return '0';
    return ethers.utils.formatEther(wei);
}

// Convert ether to wei
function etherToWei(ether) {
    if (!ether) return '0';
    return ethers.utils.parseEther(ether.toString());
}

// Get gas price
async function getGasPrice() {
    if (!window.walletProvider_ethers) {
        throw new Error('Provider not initialized');
    }
    
    try {
        const gasPrice = await window.walletProvider_ethers.getGasPrice();
        return gasPrice;
    } catch (error) {
        console.error('❌ Failed to get gas price:', error);
        throw error;
    }
}

// Estimate gas for transaction
async function estimateGas(tx) {
    if (!window.walletProvider_ethers) {
        throw new Error('Provider not initialized');
    }
    
    try {
        const gasEstimate = await window.walletProvider_ethers.estimateGas(tx);
        return gasEstimate;
    } catch (error) {
        console.error('❌ Failed to estimate gas:', error);
        throw error;
    }
}

// Get block number
async function getBlockNumber() {
    if (!window.walletProvider_ethers) {
        throw new Error('Provider not initialized');
    }
    
    try {
        const blockNumber = await window.walletProvider_ethers.getBlockNumber();
        return blockNumber;
    } catch (error) {
        console.error('❌ Failed to get block number:', error);
        throw error;
    }
}

// Get network info
async function getNetworkInfo() {
    if (!window.walletProvider_ethers) {
        throw new Error('Provider not initialized');
    }
    
    try {
        const network = await window.walletProvider_ethers.getNetwork();
        return {
            name: network.name,
            chainId: network.chainId,
            ensAddress: network.ensAddress
        };
    } catch (error) {
        console.error('❌ Failed to get network info:', error);
        throw error;
    }
}

// Check if MetaMask is installed
function isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
}

// Get MetaMask version
function getMetaMaskVersion() {
    if (!isMetaMaskInstalled()) return null;
    return window.ethereum.version;
}

// Listen for account changes
function onAccountsChanged(callback) {
    if (!window.ethereum) return;
    
    window.ethereum.on('accountsChanged', callback);
}

// Listen for chain changes
function onChainChanged(callback) {
    if (!window.ethereum) return;
    
    window.ethereum.on('chainChanged', callback);
}

// Remove event listeners
function removeAllListeners() {
    if (!window.ethereum) return;
    
    window.ethereum.removeAllListeners('accountsChanged');
    window.ethereum.removeAllListeners('chainChanged');
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('❌ Failed to copy to clipboard:', error);
        return false;
    }
}

// Generate random transaction ID
function generateTxId() {
    return '0x' + Math.random().toString(16).substr(2, 8) + Date.now().toString(16);
}

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('de-DE');
}

// Calculate transaction fee
function calculateTxFee(gasUsed, gasPrice) {
    if (!gasUsed || !gasPrice) return '0';
    const fee = gasUsed.mul(gasPrice);
    return ethers.utils.formatEther(fee);
}

// Make functions globally available
window.formatAddress = formatAddress;
window.formatBalance = formatBalance;
window.formatLargeNumber = formatLargeNumber;
window.isValidAddress = isValidAddress;
window.isValidTxHash = isValidTxHash;
window.weiToEther = weiToEther;
window.etherToWei = etherToWei;
window.getGasPrice = getGasPrice;
window.estimateGas = estimateGas;
window.getBlockNumber = getBlockNumber;
window.getNetworkInfo = getNetworkInfo;
window.isMetaMaskInstalled = isMetaMaskInstalled;
window.getMetaMaskVersion = getMetaMaskVersion;
window.onAccountsChanged = onAccountsChanged;
window.onChainChanged = onChainChanged;
window.removeAllListeners = removeAllListeners;
window.copyToClipboard = copyToClipboard;
window.generateTxId = generateTxId;
window.formatTimestamp = formatTimestamp;
window.calculateTxFee = calculateTxFee;

console.log('🔧 Web3 utilities loaded successfully');
