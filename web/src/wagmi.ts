import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// getDefaultConfig 是 RainbowKit 的便捷封装：
// 它内部帮你配好了 MetaMask / WalletConnect / Coinbase 等一堆连接器
export const config = getDefaultConfig({
  appName: '链上记事本',
  projectId: import.meta.env.VITE_WC_PROJECT_ID,
  chains: [sepolia], // 只允许 Sepolia，连错网络 RainbowKit 会提示切换
  ssr: false,
});
