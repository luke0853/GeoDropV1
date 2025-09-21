// Mining System - Complete Implementation from Backup
// Extracted from backup to keep index.html clean

// Mining machine configurations
const MINING_MACHINES = [
    { id: 1, name: 'Basic Miner', cost: 0.001, boost: 5, owned: 0, currency: 'tBNB' },
    { id: 2, name: 'Advanced Miner', cost: 0.005, boost: 15, owned: 0, currency: 'tBNB' },
    { id: 3, name: 'Pro Miner', cost: 0.02, boost: 40, owned: 0, currency: 'tBNB' },
    { id: 4, name: 'Mega Miner', cost: 0.1, boost: 100, owned: 0, currency: 'tBNB' }
];

// Wallet configuration - SECURITY FIX: Use config instead of hardcoded addresses
const WALLET_CONFIG = {
    geodropEinnahmen: window.CONFIG?.blockchain?.wallets?.geodropEinnahmen || 'MISSING_GEODROP_EINNAHMEN_ADDRESS',
    geodropLager: window.CONFIG?.blockchain?.wallets?.lagerWallet || 'MISSING_LAGER_WALLET_ADDRESS'
};

// Get machine cost for display
function getMachineCost(machineType) {
    const machines = [
        { id: 1, cost: 0.001 },
        { id: 2, cost: 0.005 },
        { id: 3, cost: 0.02 },
        { id: 4, cost: 0.1 }
    ];
    
    const machine = machines.find(m => m.id === machineType);
    return machine ? machine.cost : 0;
}

// Buy machine with real blockchain transaction
async function buyMachineWithRealTransaction(machineType) {
    if (!window.connectedWallet || !window.walletProvider_ethers) {
        showMessage('❌ Bitte zuerst Wallet verbinden!', true);
        return;
    }
    
    try {
        // Check network
        const network = await window.walletProvider_ethers.getNetwork();
        if (network.chainId !== 97 && network.chainId !== 56) {
            showMessage(`❌ Bitte auf BSC Testnet (97) oder Mainnet (56) wechseln! Aktuell: ${network.chainId}`, true);
            return;
        }
        
        // Check if target address exists
        const targetCode = await window.walletProvider_ethers.getCode(WALLET_CONFIG.geodropEinnahmen);
        if (targetCode === '0x') {
            showMessage('❌ Ziel-Adresse existiert nicht!', true);
            return;
        }
        
        // Get signer
        const signer = await window.walletProvider_ethers.getSigner();
        
        // Calculate gas limit dynamically
        const gasEstimate = await window.walletProvider_ethers.estimateGas({
            to: WALLET_CONFIG.geodropEinnahmen,
            value: ethers.utils.parseEther('0.01')
        });
        
        const gasLimit = Math.ceil(Number(gasEstimate) * 1.2); // Add 20% buffer
        
        // Create transaction
        const tx = {
            to: WALLET_CONFIG.geodropEinnahmen,
            value: ethers.utils.parseEther('0.01'),
            gasLimit: gasLimit
        };
        
        console.log('📤 Sending transaction:', {
            from: window.connectedWallet,
            to: tx.to,
            value: ethers.utils.formatEther(tx.value),
            gasLimit: tx.gasLimit
        });
        
        // Send transaction
        const txResponse = await signer.sendTransaction(tx);
        console.log('📤 Transaction sent:', txResponse.hash);
        
        showMessage('⏳ Transaktion gesendet! Warte auf Bestätigung...', false);
        
        // Wait for transaction confirmation
        const receipt = await txResponse.wait();
        
        if (receipt.status === 1) {
            console.log('✅ Transaction confirmed:', receipt.hash);
            
            // Update app data only after successful transaction
            if (window.userProfile) {
                if (!window.userProfile.ownedMachines) window.userProfile.ownedMachines = {};
                if (!window.userProfile.ownedMachines[machineType]) window.userProfile.ownedMachines[machineType] = 0;
                window.userProfile.ownedMachines[machineType]++;
                
                // Update tBNB balance
                if (typeof window.updateTbnbDisplays === 'function') {
                    await window.updateTbnbDisplays();
                }
                
                // Update mining stats
                if (typeof window.updateMiningStats === 'function') {
                    window.updateMiningStats();
                }
                
                // Save to database
                if (typeof window.updateUserProfile === 'function') {
                    await window.updateUserProfile();
                }
                
                // Ensure username is saved in userProfile
                if (window.userProfile.username && window.db && window.currentUser) {
                    await window.db.collection('users').doc(window.currentUser.uid).update({
                        username: window.userProfile.username
                    });
                }
                
                // Send Telegram notification after successful transaction
                if (typeof window.sendTelegramNotification === 'function') {
                    await window.sendTelegramNotification(machineType);
                }
                
                showMessage('✅ Mining Machine erfolgreich gekauft!', false);
            }
        } else {
            showMessage('❌ Transaktion fehlgeschlagen!', true);
        }
        
    } catch (error) {
        console.error('❌ Transaction error:', error);
        
        if (error.code === 4001) {
            showMessage('❌ Transaktion vom Benutzer abgebrochen!', true);
        } else if (error.message.includes('timeout')) {
            showMessage('❌ Transaktion-Timeout!', true);
        } else {
            showMessage(`❌ Transaktionsfehler: ${error.message}`, true);
        }
    }
}

// Buy machine function (wrapper)
function buyMachine(machineId) {
    if (!window.currentUser) {
        showMessage('Bitte zuerst anmelden.', true);
        return;
    }
    
    // Check if wallet is connected
    if (!window.connectedWallet) {
        showMessage('Bitte zuerst Wallet verbinden!', true);
        return;
    }
    
    // Find the machine by ID
    const machine = MINING_MACHINES.find(m => m.id === machineId);
    if (!machine) {
        showMessage('❌ Maschine nicht gefunden!', true);
        return;
    }
    
    // Use real blockchain transaction
    buyMachineWithRealTransaction(machineId);
}

// Update mining statistics with Diminishing Returns
async function updateMiningStats() {
    const miningBonus = document.getElementById('mining-bonus');
    const miningTbnb = document.getElementById('mining-tbnb');
    const miningMachinesCount = document.getElementById('mining-machines-count');
    
    if (miningBonus && miningTbnb && miningMachinesCount) {
        // Get owned machines from userProfile
        const ownedMachines = window.userProfile?.ownedMachines || {};
        const totalMachines = Object.values(ownedMachines).reduce((sum, count) => sum + count, 0);
        
        let totalBoost = 100; // Base 100%
        
        // Basic Miner: 5% each, but after 5th only 2.5%
        const basicCount = ownedMachines[1] || 0;
        if (basicCount <= 5) {
            totalBoost += basicCount * 5;
        } else {
            totalBoost += 5 * 5 + (basicCount - 5) * 2.5;
        }
        
        // Advanced Miner: 15% each, but after 3rd only 7.5%
        const advancedCount = ownedMachines[2] || 0;
        if (advancedCount <= 3) {
            totalBoost += advancedCount * 15;
        } else {
            totalBoost += 3 * 15 + (advancedCount - 3) * 7.5;
        }
        
        // Pro Miner: 40% each, but after 2nd only 20%
        const proCount = ownedMachines[3] || 0;
        if (proCount <= 2) {
            totalBoost += proCount * 40;
        } else {
            totalBoost += 2 * 40 + (proCount - 2) * 20;
        }
        
        // Mega Miner: 100% each, but after 1st only 50%
        const megaCount = ownedMachines[4] || 0;
        if (megaCount <= 1) {
            totalBoost += megaCount * 100;
        } else {
            totalBoost += 1 * 100 + (megaCount - 1) * 50;
        }
        
        // SECURITY FIX: NO automatic balance check - only if explicitly connected
        let realTbnbBalance = 0;
        if (window.connectedWallet && window.walletExplicitlyConnected) {
            try {
                if (typeof window.ethereum !== 'undefined') {
                    // Use web3 directly instead of ethers
                    const balance = await window.ethereum.request({
                        method: 'eth_getBalance',
                        params: [window.connectedWallet, 'latest']
                    });
                    // Convert from wei to tBNB (divide by 10^18)
                    realTbnbBalance = parseInt(balance, 16) / Math.pow(10, 18);
                    console.log('💰 updateMiningStats: Using REAL wallet balance:', realTbnbBalance);
                }
            } catch (error) {
                console.error('❌ Error getting real balance in updateMiningStats:', error);
                realTbnbBalance = 0;
            }
        }
        
        miningBonus.textContent = totalBoost.toFixed(1) + '%';
        miningTbnb.textContent = realTbnbBalance.toFixed(6);
        miningMachinesCount.textContent = totalMachines;
        
        console.log('📊 Mining stats updated:', {
            ownedMachines,
            totalMachines,
            totalBoost,
            realTbnbBalance
        });
    }
}

// Load mining machines list
function loadMiningMachinesList() {
    const machinesList = document.getElementById('mining-machines-list');
    if (!machinesList) return;
    
    machinesList.innerHTML = '';
    
    MINING_MACHINES.forEach(machine => {
        const ownedCount = window.userProfile?.ownedMachines?.[machine.id] || 0;
        
        const machineElement = document.createElement('div');
        machineElement.className = 'bg-gray-800 p-4 rounded-lg border border-gray-700';
        machineElement.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h3 class="text-lg font-semibold text-white">${machine.name}</h3>
                <span class="text-green-400 font-bold">${machine.cost} ${machine.currency}</span>
            </div>
            <div class="text-sm text-gray-300 mb-3">
                <div>Boost: +${machine.boost}%</div>
                <div>Besessen: ${ownedCount}</div>
            </div>
            <button onclick="buyMachine(${machine.id})" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Kaufen (${machine.cost} ${machine.currency})
            </button>
        `;
        machinesList.appendChild(machineElement);
    });
}

// Show mining machines popup
function showMiningMachinesPopup() {
    const popup = document.getElementById('mining-machines-popup');
    if (popup) {
        popup.style.display = 'block';
        loadMiningMachinesList();
    }
}

// Close mining machines popup
function closeMiningMachinesPopup() {
    const popup = document.getElementById('mining-machines-popup');
    if (popup) {
        popup.style.display = 'none';
    }
}

// Make functions globally available
window.buyMachineWithRealTransaction = buyMachineWithRealTransaction;
window.buyMachine = buyMachine;
window.updateMiningStats = updateMiningStats;
window.loadMiningMachinesList = loadMiningMachinesList;
window.showMiningMachinesPopup = showMiningMachinesPopup;
window.closeMiningMachinesPopup = closeMiningMachinesPopup;
window.getMachineCost = getMachineCost;

console.log('⛏️ Mining system loaded successfully');
