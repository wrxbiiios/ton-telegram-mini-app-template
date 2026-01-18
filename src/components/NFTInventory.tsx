import React from 'react';
import { NFTUpgrade } from '../game/types';

interface NFTInventoryProps {
  nfts: NFTUpgrade[];
  onClose: () => void;
  onEquip?: (nftId: string) => void;
}

export const NFTInventory: React.FC<NFTInventoryProps> = ({ nfts, onClose, onEquip }) => {
  const getNFTIcon = (type: string) => {
    switch (type) {
      case 'weapon': return '⚔️';
      case 'armor': return '🛡️';
      case 'ability': return '⚡';
      case 'cosmetic': return '🎨';
      default: return '📦';
    }
  };

  const getNFTColor = (type: string) => {
    switch (type) {
      case 'weapon': return 'from-red-600 to-orange-600';
      case 'armor': return 'from-blue-600 to-cyan-600';
      case 'ability': return 'from-purple-600 to-pink-600';
      case 'cosmetic': return 'from-green-600 to-teal-600';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black max-w-4xl w-full max-h-[90vh] rounded-lg border-2 border-purple-500 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">NFT Inventory</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {nfts.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="text-6xl">📦</div>
              <p className="text-gray-400 text-lg">No NFTs found</p>
              <p className="text-gray-500 text-sm">Connect your TON wallet to view your NFT collection</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nfts.map((nft) => (
                <div
                  key={nft.id}
                  className={`bg-gradient-to-br ${getNFTColor(nft.type)} p-4 rounded-lg border-2 border-opacity-50 border-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{getNFTIcon(nft.type)}</div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{nft.name}</h3>
                      <p className="text-gray-200 text-sm mb-2">{nft.description}</p>
                      
                      {/* Stats */}
                      <div className="space-y-1 text-xs">
                        {nft.bonus.damage && (
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-300">⚔️ Damage:</span>
                            <span className="text-white font-bold">+{nft.bonus.damage}x</span>
                          </div>
                        )}
                        {nft.bonus.fireRate && (
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-300">⚡ Fire Rate:</span>
                            <span className="text-white font-bold">+{nft.bonus.fireRate}x</span>
                          </div>
                        )}
                        {nft.bonus.health && (
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-300">❤️ Health:</span>
                            <span className="text-white font-bold">+{nft.bonus.health}</span>
                          </div>
                        )}
                        {nft.bonus.speed && (
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-300">🏃 Speed:</span>
                            <span className="text-white font-bold">+{nft.bonus.speed}x</span>
                          </div>
                        )}
                        {nft.bonus.shield && (
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-300">🛡️ Shield:</span>
                            <span className="text-white font-bold">+{nft.bonus.shield}</span>
                          </div>
                        )}
                      </div>

                      {/* Equip Button */}
                      {onEquip && (
                        <button
                          onClick={() => onEquip(nft.id)}
                          className="mt-3 w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-2 px-4 rounded transition-all"
                        >
                          Equipped ✓
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Section */}
          <div className="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-cyan-500">
            <h3 className="text-cyan-400 font-bold mb-2">About NFT Upgrades</h3>
            <p className="text-gray-300 text-sm">
              NFT upgrades are automatically applied to your character when you own them. 
              Each NFT provides specific bonuses that stack with other NFTs. 
              Trade and collect NFTs on the TON blockchain to become more powerful!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
