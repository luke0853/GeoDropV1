// Pool Wallet Functions for GeoDrop App

// Pool Wallet Display Functions
window.updatePoolWalletDisplay = function() {
    const poolEinnahmen = document.getElementById('pool-einnahmen');
    const poolLager = document.getElementById('pool-lager');
    const poolContract = document.getElementById('pool-contract');
    const poolBalance = document.getElementById('pool-balance');
    
    // Dev Tab Pool Wallet Elements
    const poolPixeldrops = document.getElementById('pool-pixeldrops');
    const poolBnb = document.getElementById('pool-bnb');
    
    if (poolEinnahmen) {
        const truncated = `${window.CONFIG.blockchain.wallets.geodropEinnahmen.substring(0, 6)}...${window.CONFIG.blockchain.wallets.geodropEinnahmen.substring(window.CONFIG.blockchain.wallets.geodropEinnahmen.length - 4)}`;
        poolEinnahmen.textContent = truncated;
    }
    
    if (poolLager) {
        const truncated = `${window.CONFIG.blockchain.wallets.lagerWallet.substring(0, 6)}...${window.CONFIG.blockchain.wallets.lagerWallet.substring(window.CONFIG.blockchain.wallets.lagerWallet.length - 4)}`;
        poolLager.textContent = truncated;
    }
    
    if (poolContract) {
        const truncated = `${window.CONFIG.blockchain.contracts.pixelDrop.substring(0, 6)}...${window.CONFIG.blockchain.contracts.pixelDrop.substring(window.CONFIG.blockchain.contracts.pixelDrop.length - 4)}`;
        poolContract.textContent = truncated;
    }
    
    if (poolBalance) {
        // This would be updated with real blockchain data
        poolBalance.textContent = '0.00 tBNB';
    }
    
    // Update Dev Tab Pool Wallet Display
    if (poolPixeldrops) {
        poolPixeldrops.textContent = 'Lädt...';
    }
    if (poolBnb) {
        poolBnb.textContent = 'Lädt...';
    }
    
    // Fetch real pool wallet data
    updatePoolWalletBalances();
}

// Function to update pool wallet balances
window.updatePoolWalletBalances = async function() {
    try {
        console.log('🏦 Updating pool wallet balances...');
        
        if (!window.ethereum) {
            console.log('❌ No ethereum provider');
            return;
        }
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const poolWalletAddress = window.CONFIG.blockchain.wallets.poolWallet;
        
        // Get BNB balance
        const bnbBalance = await provider.getBalance(poolWalletAddress);
        const bnbFormatted = ethers.utils.formatEther(bnbBalance);
        
        // Get PixelDrop balance
        const pixeldropContractAddress = window.CONFIG.blockchain.contracts.pixelDrop;
        const erc20Abi = [
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)"
        ];
        
        const pixeldropContract = new ethers.Contract(pixeldropContractAddress, erc20Abi, provider);
        const pixeldropBalance = await pixeldropContract.balanceOf(poolWalletAddress);
        const decimals = await pixeldropContract.decimals();
        const pixeldropFormatted = ethers.utils.formatUnits(pixeldropBalance, decimals);
        
        // Update display
        const poolPixeldrops = document.getElementById('pool-pixeldrops');
        const poolBnb = document.getElementById('pool-bnb');
        
        if (poolPixeldrops) {
            poolPixeldrops.textContent = `${parseFloat(pixeldropFormatted).toFixed(2)} PD`;
        }
        if (poolBnb) {
            poolBnb.textContent = `${parseFloat(bnbFormatted).toFixed(4)} tBNB`;
        }
        
        console.log('✅ Pool wallet balances updated');
        
    } catch (error) {
        console.error('❌ Error updating pool wallet balances:', error);
        const poolPixeldrops = document.getElementById('pool-pixeldrops');
        const poolBnb = document.getElementById('pool-bnb');
        
        if (poolPixeldrops) {
            poolPixeldrops.textContent = 'Fehler';
        }
        if (poolBnb) {
            poolBnb.textContent = 'Fehler';
        }
    }
}

// Initialize pool wallet on page load
window.initializePoolWallet = function() {
    console.log('🏦 Initializing pool wallet...');
    updatePoolWalletDisplay();
}

// Make functions globally available
window.updatePoolWalletDisplay = window.updatePoolWalletDisplay;
window.updatePoolWalletBalances = window.updatePoolWalletBalances;
window.initializePoolWallet = window.initializePoolWallet;
