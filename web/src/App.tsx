import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { NOTEPAD_ABI, NOTEPAD_ADDRESS } from './contracts/notepad';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';

const EXPLORER = `https://sepolia.etherscan.io/address/${NOTEPAD_ADDRESS}`;

export default function App() {
  const { address, isConnected, chain } = useAccount();
  const { switchChain, isPending: switching } = useSwitchChain();

  // 读操作提到 App 层，这样表单写完能拿到 refetch 去刷新列表
  const {
    data: notes,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: NOTEPAD_ADDRESS,
    abi: NOTEPAD_ABI,
    functionName: 'getNotes',
    args: address ? [address] : undefined, // 钱包没连上时别发请求
    query: { enabled: Boolean(address) },
  });

  const wrongNetwork = Boolean(chain) && chain?.id !== sepolia.id;
  const total = (notes ?? []).filter((n) => !n.deleted).length;

  return (
    <div className="app">
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-glow" aria-hidden="true" />
      <div className="bg-scan" aria-hidden="true" />

      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ▚
          </span>
          <span className="brand-text">
            <span className="brand-name">CHAIN NOTEPAD</span>
            <span className="brand-sub">链上记事本</span>
          </span>
        </div>
        <ConnectButton showBalance={false} accountStatus="address" />
      </header>

      <main className="shell">
        {!isConnected ? (
          <section className="hero">
            <p className="hero-kicker">DECENTRALIZED · IMMUTABLE · YOURS</p>
            <h1 className="hero-title">把想法写进区块链</h1>
            <p className="hero-sub">
              没有服务器，没有数据库。你写下的每一条笔记都由智能合约保存在
              以太坊 Sepolia 测试网上，只有你的私钥能修改它。
            </p>
            <p className="hero-hint caret">连接右上角的钱包开始</p>
          </section>
        ) : (
          <>
            {wrongNetwork && (
              <div className="guard">
                <span>
                  当前网络是 {chain?.name}，本应用只在 Sepolia 测试网上运行。
                </span>
                <button
                  type="button"
                  onClick={() => switchChain({ chainId: sepolia.id })}
                  disabled={switching}
                >
                  {switching ? '切换中…' : '一键切换'}
                </button>
              </div>
            )}

            <div className="statbar">
              <div className="stat">
                <div className="stat-k">WALLET</div>
                <div className="stat-v">{address}</div>
              </div>
              <div className="stat">
                <div className="stat-k">NETWORK</div>
                <div className={wrongNetwork ? 'stat-v' : 'stat-v live'}>
                  <span className="dot" />
                  {chain?.name ?? '未知'}
                </div>
              </div>
              <div className="stat">
                <div className="stat-k">CONTRACT</div>
                <div className="stat-v">
                  <a href={EXPLORER} target="_blank" rel="noopener">
                    {NOTEPAD_ADDRESS.slice(0, 6)}…{NOTEPAD_ADDRESS.slice(-4)}
                  </a>
                </div>
              </div>
            </div>

            {/* 写完后调 refetch，列表就会更新 */}
            <NoteForm onSaved={refetch} disabled={wrongNetwork} />

            <div className="panel-title" style={{ marginTop: 28 }}>
              我的笔记 · {total}
            </div>
            <NoteList
              notes={notes}
              isLoading={isLoading}
              error={error}
              onChanged={refetch}
            />
          </>
        )}
      </main>

      <footer className="foot">
        合约已在 Etherscan 开源验证 ·{' '}
        <a href={EXPLORER} target="_blank" rel="noopener">
          查看源码
        </a>
      </footer>
    </div>
  );
}
