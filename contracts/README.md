# Smart Contract Development Notes

## Future Improvements

### Leaderboard.fc
The current implementation has hardcoded reward amounts (1 TON, 0.5 TON, 0.25 TON). For production deployment, these should be made configurable via admin functions to allow adjustments without contract redeployment.

**Suggested enhancement:**
```func
;; Add reward configuration to storage
(slice, int, cell, cell) load_data() inline {
    slice ds = get_data().begin_parse();
    return (
        ds~load_msg_addr(), ;; admin_address
        ds~load_uint(64),   ;; total_players
        ds~load_dict(),     ;; top_scores_dict
        ds~load_dict()      ;; reward_config_dict (new)
    );
}

;; Add admin function to update rewards
if (op == 3) { ;; update_rewards
    throw_unless(401, equal_slices(sender_address, admin_address));
    
    int rank = in_msg_body~load_uint(8);
    int reward = in_msg_body~load_coins();
    
    ;; Update reward_config_dict
    ;; ...
}
```

## Deployment Checklist

- [ ] Test contracts on TON testnet
- [ ] Verify admin addresses
- [ ] Set initial reward amounts
- [ ] Deploy to mainnet
- [ ] Verify contract code
- [ ] Update frontend with contract addresses

## Contract Addresses

Update these in `vite.config.ts` after deployment:

```typescript
__CONTRACT_ADDRESS__: JSON.stringify('EQ...'), // GameToken
__NFT_CONTRACT__: JSON.stringify('EQ...'),     // AchievementNFT
__LEADERBOARD_CONTRACT__: JSON.stringify('EQ...'), // Leaderboard
```

## Security Considerations

1. **Admin Key Management**: Store admin private keys securely
2. **Upgrade Path**: Consider using proxy patterns for upgradability
3. **Rate Limiting**: Implement claim cooldowns to prevent abuse
4. **Balance Checks**: Ensure contract has sufficient TON for rewards
5. **Access Control**: Verify all admin functions have proper checks

## Testing

```bash
# Install TON development tools
npm install -g ton-compiler

# Compile contracts
func -o GameToken.fif GameToken.fc
func -o AchievementNFT.fif AchievementNFT.fc
func -o Leaderboard.fif Leaderboard.fc

# Deploy to testnet
# (Use TON SDK or CLI tools)
```

## Gas Optimization

Current contracts are simple and gas-efficient. For production:
- Monitor gas costs for common operations
- Optimize dictionary operations if needed
- Consider batching for multiple operations

## Audit Recommendations

Before mainnet deployment:
1. Professional smart contract audit
2. Formal verification of critical functions
3. Test coverage for all edge cases
4. Load testing for concurrent operations

## Integration with Frontend

Update `src/hooks/useTonContract.ts` (to be created):

```typescript
export function useGameToken() {
  const contract = useTonContract(GAME_TOKEN_ADDRESS);
  
  const claimDailyReward = async () => {
    // Implementation
  };
  
  return { claimDailyReward };
}
```
