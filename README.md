# 链上记事本 · CHAIN NOTEPAD

一个跑在以太坊 **Sepolia 测试网**上的去中心化记事本。没有服务器、没有数据库，
所有笔记由智能合约保存在链上，只有持有私钥的钱包能写入和删除自己的内容。

Web3 第一课作业。

**🔗 在线体验：<https://kashen336699-ks.github.io/onchain-notepad/>**

（需要浏览器装有 MetaMask，并把网络切到 Sepolia 测试网。测试币可从
<https://sepoliafaucet.com> 等水龙头领取。）

---

## 合约

| 项目 | 值 |
|---|---|
| 合约地址 | `0x29Ddd31020283160cF31b2B9ff207b9b4cB7025F` |
| 网络 | Sepolia 测试网（chainId `11155111`） |
| Etherscan | <https://sepolia.etherscan.io/address/0x29Ddd31020283160cF31b2B9ff207b9b4cB7025F> |
| 源码验证 | ✅ 已开源验证，**Exact Match** |
| 编译器 | Solidity `v0.8.24+commit.e11b9ed9`，optimizer 开启 200 runs，EVM 版本 `paris` |
| 运行时字节码 | 2059 字节 |

合约源码：[`contract/contracts/Notepad.sol`](contract/contracts/Notepad.sol)

### 合约接口

| 函数 | 类型 | 说明 |
|---|---|---|
| `addNote(string content)` | write | 新增笔记，内容上限 **280 字节**（一个汉字 3 字节） |
| `deleteNote(uint256 id)` | write | 软删除，把 `deleted` 标记为 true，数据仍留在链上 |
| `getNotes(address user)` | view | 返回该地址的全部笔记 |
| `noteCount(address user)` | view | 返回该地址的笔记条数 |

两个事件：`NoteCreated(author, id, content, createdAt)`、`NoteDeleted(author, id)`。

> **关于隐私**：mapping 隔离的是**写**（`msg.sender` 伪造不了），**读是完全公开的**。
> `getNotes(address)` 按参数查询，不看调用者是谁 —— 任何人都能读到任何地址的笔记全文。
> 链上没有"私密"这回事。

---

## 技术栈

**合约端**：Hardhat 2.29 · Solidity 0.8.24 · Ethers · Etherscan 验证插件

**前端**：Vite 8 · React 19 · TypeScript 6 · wagmi 2 · viem 2 · RainbowKit 2 · TanStack Query 5

> ⚠️ wagmi 必须锁在 **2.x**。RainbowKit 2.2.11 的 peerDependency 是 `wagmi@^2.9.0`，
> 直接 `npm i wagmi` 会装到 3.x，npm 只 warn 不拦，但运行时会因 API 变更而崩。

---

## 本地运行

### 1. 合约

```bash
cd contract
npm install
cp .env.example .env      # 填入 PRIVATE_KEY / SEPOLIA_RPC_URL / ETHERSCAN_API_KEY
npx hardhat test          # 5 passing
npx hardhat run scripts/deploy.js --network sepolia
```

部署脚本会自动把地址和 ABI 导出到 `web/src/contracts/notepad.ts`。

### 2. 前端

```bash
cd web
npm install
echo "VITE_WC_PROJECT_ID=你的 Reown Project ID" > .env.local
npm run dev
```

打开 <http://localhost:5173>。

> Reown（原 WalletConnect）Project ID 在 <https://dashboard.reown.com> 申请，免费版 1 个项目。
> 它只服务于「手机扫码连钱包」，MetaMask 浏览器插件走的是 injected connector，不需要它。
>
> **改完 `.env.local` 必须重启 dev server** —— Vite 只在启动时读环境变量。

---

## 项目结构

```
onchain-notepad/
├── contract/
│   ├── contracts/Notepad.sol       合约源码（66 行）
│   ├── test/Notepad.test.js        5 个测试用例
│   ├── scripts/deploy.js           部署 + 自动导出 ABI 给前端
│   ├── hardhat.config.js           Solidity 0.8.24 + Sepolia + Etherscan
│   └── .env                        ⚠️ 含私钥，已 gitignore，绝不提交
└── web/
    ├── src/
    │   ├── wagmi.ts                wagmi 配置（只允许 Sepolia）
    │   ├── main.tsx                Provider 三层：Wagmi → QueryClient → RainbowKit
    │   ├── App.tsx                 读合约 + 网络守卫 + 布局
    │   ├── index.css               赛博未来科技风设计系统
    │   ├── components/
    │   │   ├── NoteForm.tsx        写入：useWriteContract + 等待 receipt
    │   │   ├── NoteList.tsx        列表容器
    │   │   ├── NoteItem.tsx        单条笔记 + 删除
    │   │   └── types.ts            从 ABI 推导出的类型
    │   └── contracts/notepad.ts    部署脚本自动生成，勿手改
    └── .env.local                  ⚠️ 只放 Project ID，永远不放私钥
```

---

## 几个踩过的坑

**BigInt**：Solidity 的 `uint256` 到 JS 里是 BigInt（`123n`）。直接塞进 JSX 会报
`Cannot convert a BigInt value to a number`。规则：**要显示就 `.toString()`，要算数就 `Number()`**。
时间戳是秒，`Date` 要毫秒，所以 `× 1000`。

**Provider 嵌套顺序不能乱**：`WagmiProvider` → `QueryClientProvider` → `RainbowKitProvider`。
被依赖的必须在外层，错了直接报 `useConfig must be used within WagmiProvider`。

**拿到交易哈希 ≠ 写入成功**：哈希只代表交易广播出去了。必须等
`useWaitForTransactionReceipt` 的 `isSuccess` 才能刷新列表，否则读回来还是旧数据。

**字节不是字符**：合约的 `require(bytes(content).length <= 280)` 数的是 UTF-8 字节，
一个汉字 3 字节。前端用 `new TextEncoder().encode(text).length` 算，跟合约保持一致，
否则用户白付 gas 被 revert。

---

## 安全

- `contract/.env` 已在 `.gitignore` 中，私钥不会进 Git
- 使用全新的测试专用钱包，只持有 Sepolia 测试币，无任何真实资产
- 前端 `.env.local` 只有 Reown Project ID —— 带 `VITE_` 前缀的变量会被打进前端包，
  F12 就能看到，所以**任何密钥都不能加 `VITE_` 前缀**
