# 🎰 NoCap Lottery - No-Loss DeFi Lottery Protocol

> **Winner takes the yield, everyone keeps their principal**

NoCap Lottery is a revolutionary no-loss lottery protocol built on Ethereum that allows users to participate in lotteries without risking their principal. By leveraging DeFi yield generation through Aave V3, only the accumulated interest is distributed to winners while all participants can withdraw their original deposits anytime.

---

## 🌟 Overview

Traditional lotteries require participants to forfeit their ticket money with only a small chance of winning. NoCap Lottery changes this paradigm completely:

- ✅ **Deposit** stablecoins, ETH, or BTC
- ✅ **Generate yield** through Aave V3 integration
- ✅ **Win prizes** from accumulated interest
- ✅ **Withdraw** your principal anytime - zero loss

This is DeFi at its finest: **fair, transparent, and truly no-loss.**

---

## 🏗️ Architecture

### Smart Contracts

#### 1. **USDCVault4626** (ERC-4626 Vault)
Custom yield-bearing vault that implements the ERC-4626 standard:

- **Accepts**: USDC deposits from users
- **Supplies**: USDC to Aave V3 lending pool
- **Tracks**: Yield via aUSDC (Aave's interest-bearing token)
- **Provides**: Standard vault interface for the lottery contract

#### 2. **Lottery Contract** *(Coming Soon)*
Main lottery logic that:
- Manages ticket purchases using vault shares
- Selects winners using Chainlink VRF
- Distributes yield-based prizes
- Handles withdrawals and deposits

### Integration Flow

```
┌──────────────┐
│    Users     │
└──────┬───────┘
       │ Deposit USDC
       ▼
┌──────────────────────┐
│  USDCVault4626       │
│  (ERC-4626 Vault)    │
└──────┬───────────────┘
       │ supply()
       ▼
┌──────────────────────┐
│   Aave V3 Pool       │
│   (Sepolia)          │
└──────┬───────────────┘
       │ Mint aUSDC
       ▼
┌──────────────────────┐
│  Interest Accrues    │
│  (Yield Generation)  │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  Lottery Contract    │
│  (Distributes Yield) │
└──────────────────────┘
```

---

## 📝 Smart Contract Addresses (Sepolia Testnet)

### Deployed Contracts

| Contract | Address | Network |
|----------|---------|---------|
| USDCVault4626 | `TBD` | Sepolia |
| Lottery Contract | `Coming Soon` | Sepolia |

### Aave V3 Integration (Sepolia)

| Component | Address | Verified |
|-----------|---------|----------|
| **USDC Token** | `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8` | ✅ [View on Etherscan](https://sepolia.etherscan.io/address/0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8) |
| **Aave V3 Pool** | `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2` | ✅ [View on Etherscan](https://sepolia.etherscan.io/address/0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2) |
| **aUSDC Token** | [See Aave Address Book](https://github.com/bgd-labs/aave-address-book/blob/main/src/AaveV3Sepolia.sol) | ✅ |

> **Note**: All addresses are sourced from official Aave V3 deployments and verified on Sepolia Etherscan.

---

## 🚀 Features

### Current Implementation (v0.1)

- ✅ **USDC Vault Integration**
  - ERC-4626 compliant vault
  - Aave V3 yield generation
  - Deposit/withdraw functionality
  - Share-based accounting

- ✅ **Frontend Interface**
  - Modern React UI with Vite
  - RainbowKit wallet connection
  - Wagmi + Viem for Web3 interactions
  - Real-time transaction tracking

- ✅ **Cross-Chain Bridge**
  - LiFi SDK integration
  - Multi-chain asset bridging
  - Seamless UX for deposits

### Roadmap (v0.2+)

- 🔄 **Multi-Asset Support**
  - DAI, USDT, USDC vaults
  - ETH vault (via Aave ETH market)
  - WBTC vault support
  - Automatic asset routing

- 🔄 **Lottery Mechanism**
  - Chainlink VRF for provably fair randomness
  - Multiple prize tiers
  - Weekly/daily draw schedules
  - Instant withdraw (before draw)

- 🔄 **Advanced Features**
  - Referral rewards
  - Governance token ($NOCAP)
  - Cross-chain lottery participation
  - Prize pools & jackpots

---

## 🛠️ Technical Stack

### Smart Contracts
- **Solidity** ^0.8.20
- **OpenZeppelin** (ERC-4626, Access Control)
- **Aave V3** (Yield generation)
- **Chainlink VRF** (Randomness)

### Frontend
- **React** 18.3
- **Vite** 6.0
- **RainbowKit** 2.2 (Wallet connection)
- **Wagmi** 2.12 (Ethereum interactions)
- **Viem** 2.45 (TypeScript interface)
- **LiFi SDK** 3.15 (Cross-chain bridging)
- **Ethers.js** 6.9

### Infrastructure
- **Sepolia Testnet** (Current deployment)
- **Mainnet** (Future deployment)

---

## 📦 Installation & Setup

### Prerequisites

- Node.js >= 18.x
- npm or yarn
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH (for gas)

### Frontend Setup

```bash
# Clone the repository
git clone <repository-url>
cd NoCap-Lottery/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

### Smart Contract Deployment

```solidity
// Deploy USDCVault4626 (Remix or Hardhat)

constructor(
  address _usdcToken,    // 0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8
  address _aavePool,     // 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2
  address _aUsdcToken    // From Aave Address Book
)
```

---

## 🎮 How It Works

### For Users

1. **Connect Wallet**
   - Use RainbowKit to connect your Web3 wallet
   - Switch to Sepolia testnet (or mainnet when deployed)

2. **Deposit Assets**
   - Choose USDC (more assets coming soon)
   - Specify deposit amount
   - Approve & deposit transaction
   - Receive vault shares

3. **Enter Lottery**
   - Your deposit automatically earns yield via Aave
   - Accumulated interest goes into prize pool
   - No additional action required

4. **Win or Withdraw**
   - **Win**: Claim your yield-based prize
   - **Withdraw**: Pull out principal anytime (no loss)

### For Developers

```javascript
// Example: Deposit USDC into vault
import { writeContract } from '@wagmi/core';

const deposit = async (amount) => {
  // Approve USDC
  await writeContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [VAULT_ADDRESS, amount]
  });
  
  // Deposit to vault
  await writeContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'deposit',
    args: [amount, userAddress]
  });
};
```

---

## 🔐 Security

### Audits
- 🔄 **In Progress**: Smart contract security audit
- ✅ **OpenZeppelin**: Using battle-tested ERC-4626 implementation
- ✅ **Aave V3**: Leveraging audited lending protocol

### Best Practices
- Minimal custom logic (rely on standards)
- Comprehensive unit tests
- Testnet deployment before mainnet
- Gradual rollout with limits

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🔗 Links

- **Documentation**: Coming Soon
- **Twitter**: Coming Soon
- **Discord**: Coming Soon
- **Aave Address Book**: [GitHub](https://github.com/bgd-labs/aave-address-book)
- **Aave V3 Docs**: [Aave Docs](https://docs.aave.com)

---

## 💬 FAQ

### Is this really no-loss?

Yes! Your principal is always withdrawable. Only the yield generated from Aave is used for prizes.

### What if I don't win?

You can withdraw your full deposit at any time (minus gas fees). The only "cost" is the opportunity cost of yields you could have earned elsewhere.

### Which assets are supported?

Currently: **USDC on Sepolia**
Coming soon: DAI, USDT, ETH, WBTC

### How are winners selected?

Using Chainlink VRF (Verifiable Random Function) for provably fair, tamper-proof randomness.

### Can I withdraw before a draw?

Absolutely! Withdraw anytime before the draw executes.

### What about gas fees?

Users pay gas for deposits/withdrawals. Prize distribution gas is handled by the protocol.

---

## 🏆 Built For HackMoney 2026

This project demonstrates:
- ✅ Real DeFi composability (Aave integration)
- ✅ ERC-4626 tokenized vault standard
- ✅ Modern Web3 frontend (RainbowKit + Wagmi)
- ✅ Cross-chain capabilities (LiFi)
- ✅ Innovative no-loss mechanism

---

## 👥 Team

Built with ❤️ by the NoCap team

---

## 🙏 Acknowledgments

- **Aave**: For the robust lending protocol
- **OpenZeppelin**: For secure contract libraries
- **Chainlink**: For decentralized randomness
- **RainbowKit & Wagmi**: For excellent Web3 developer experience
- **LiFi**: For seamless cross-chain bridging

---

<div align="center">

**[Website](#) • [Docs](#) • [Twitter](#) • [Discord](#)**

Made with 💜 in Web3

</div>
