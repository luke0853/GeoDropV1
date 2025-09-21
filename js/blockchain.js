// Blockchain Integration - Web3 and Ethers.js
// Extracted from backup to keep index.html clean

// Global blockchain variables
let walletProvider_ethers = null;
let connectedWallet = null;

// Blockchain configuration
const BLOCKCHAIN_CONFIG = {
    // BSC Testnet
    testnet: {
        chainId: 97,
        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        name: 'BSC Testnet'
    },
    // BSC Mainnet
    mainnet: {
        chainId: 56,
        rpcUrl: 'https://bsc-dataseed.binance.org/',
        name: 'BSC Mainnet'
    }
};

// Initialize blockchain provider
async function initializeBlockchainProvider() {
    if (window.ethereum) {
        try {
            walletProvider_ethers = new ethers.providers.Web3Provider(window.ethereum);
            console.log('✅ Blockchain provider initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize blockchain provider:', error);
            return false;
        }
    } else {
        console.error('❌ MetaMask not installed');
        return false;
    }
}

// Check if connected to correct network
async function checkNetwork() {
    if (!walletProvider_ethers) {
        return { valid: false, message: 'Provider not initialized' };
    }
    
    try {
        const network = await walletProvider_ethers.getNetwork();
        const chainId = network.chainId;
        
        if (chainId === BLOCKCHAIN_CONFIG.testnet.chainId) {
            return { valid: true, network: 'testnet', chainId };
        } else if (chainId === BLOCKCHAIN_CONFIG.mainnet.chainId) {
            return { valid: true, network: 'mainnet', chainId };
        } else {
            return { 
                valid: false, 
                message: `Wrong network. Please switch to BSC Testnet (97) or Mainnet (56). Current: ${chainId}` 
            };
        }
    } catch (error) {
        console.error('❌ Network check error:', error);
        return { valid: false, message: 'Network check failed' };
    }
}

// Switch to BSC Testnet
async function switchToTestnet() {
    if (!window.ethereum) {
        throw new Error('MetaMask not installed');
    }
    
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x61' }], // 97 in hex
        });
        console.log('✅ Switched to BSC Testnet');
        return true;
    } catch (error) {
        if (error.code === 4902) {
            // Chain not added, add it
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x61',
                        chainName: 'BSC Testnet',
                        nativeCurrency: {
                            name: 'tBNB',
                            symbol: 'tBNB',
                            decimals: 18,
                        },
                        rpcUrls: [BLOCKCHAIN_CONFIG.testnet.rpcUrl],
                        blockExplorerUrls: ['https://testnet.bscscan.com/'],
                    }],
                });
                console.log('✅ Added and switched to BSC Testnet');
                return true;
            } catch (addError) {
                console.error('❌ Failed to add BSC Testnet:', addError);
                throw addError;
            }
        } else {
            console.error('❌ Failed to switch to BSC Testnet:', error);
            throw error;
        }
    }
}

// Switch to BSC Mainnet
async function switchToMainnet() {
    if (!window.ethereum) {
        throw new Error('MetaMask not installed');
    }
    
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }], // 56 in hex
        });
        console.log('✅ Switched to BSC Mainnet');
        return true;
    } catch (error) {
        if (error.code === 4902) {
            // Chain not added, add it
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x38',
                        chainName: 'BSC Mainnet',
                        nativeCurrency: {
                            name: 'BNB',
                            symbol: 'BNB',
                            decimals: 18,
                        },
                        rpcUrls: [BLOCKCHAIN_CONFIG.mainnet.rpcUrl],
                        blockExplorerUrls: ['https://bscscan.com/'],
                    }],
                });
                console.log('✅ Added and switched to BSC Mainnet');
                return true;
            } catch (addError) {
                console.error('❌ Failed to add BSC Mainnet:', addError);
                throw addError;
            }
        } else {
            console.error('❌ Failed to switch to BSC Mainnet:', error);
            throw error;
        }
    }
}

// Get wallet balance
async function getWalletBalance(address) {
    if (!walletProvider_ethers) {
        throw new Error('Provider not initialized');
    }
    
    try {
        const balance = await walletProvider_ethers.getBalance(address);
        return ethers.utils.formatEther(balance);
    } catch (error) {
        console.error('❌ Failed to get wallet balance:', error);
        throw error;
    }
}

// Send transaction
async function sendTransaction(to, value, gasLimit = 21000) {
    if (!walletProvider_ethers || !connectedWallet) {
        throw new Error('Provider or wallet not initialized');
    }
    
    try {
        const signer = walletProvider_ethers.getSigner();
        const tx = {
            to: to,
            value: ethers.utils.parseEther(value.toString()),
            gasLimit: gasLimit
        };
        
        console.log('📤 Sending transaction:', tx);
        const txResponse = await signer.sendTransaction(tx);
        console.log('📤 Transaction sent:', txResponse.hash);
        
        return txResponse;
    } catch (error) {
        console.error('❌ Transaction failed:', error);
        throw error;
    }
}

// Wait for transaction confirmation
async function waitForTransactionConfirmation(txResponse) {
    try {
        console.log('⏳ Waiting for transaction confirmation...');
        const receipt = await txResponse.wait();
        console.log('✅ Transaction confirmed:', receipt);
        return receipt;
    } catch (error) {
        console.error('❌ Transaction confirmation failed:', error);
        throw error;
    }
}

// Check if address is a contract
async function isContract(address) {
    if (!walletProvider_ethers) {
        throw new Error('Provider not initialized');
    }
    
    try {
        const code = await walletProvider_ethers.getCode(address);
        return code !== '0x';
    } catch (error) {
        console.error('❌ Failed to check if address is contract:', error);
        throw error;
    }
}

// Get transaction details
async function getTransactionDetails(txHash) {
    if (!walletProvider_ethers) {
        throw new Error('Provider not initialized');
    }
    
    try {
        const tx = await walletProvider_ethers.getTransaction(txHash);
        const receipt = await walletProvider_ethers.getTransactionReceipt(txHash);
        return { transaction: tx, receipt: receipt };
    } catch (error) {
        console.error('❌ Failed to get transaction details:', error);
        throw error;
    }
}

// Format BSC scan URL
function getBscScanUrl(txHash, isTestnet = true) {
    const baseUrl = isTestnet ? 'https://testnet.bscscan.com' : 'https://bscscan.com';
    return `${baseUrl}/tx/${txHash}`;
}

// Make functions globally available
window.initializeBlockchainProvider = initializeBlockchainProvider;
window.checkNetwork = checkNetwork;
window.switchToTestnet = switchToTestnet;
window.switchToMainnet = switchToMainnet;
window.getWalletBalance = getWalletBalance;
window.sendTransaction = sendTransaction;
window.waitForTransactionConfirmation = waitForTransactionConfirmation;
window.isContract = isContract;
window.getTransactionDetails = getTransactionDetails;
window.getBscScanUrl = getBscScanUrl;

console.log('⛓️ Blockchain system loaded successfully');
