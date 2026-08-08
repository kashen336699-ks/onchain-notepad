# 链上记事本 DApp · 作业进度

> 最后更新：2026-08-08（暂停：用户去吃早饭，Cloudflare Pages 配到一半）
> 对照手册：`class9/链上记事本-开发手册.html`

## 总进度：01–06 完成（链上全部 + 前端脚手架）；下一步阶段 07 接钱包

**当前配合方式（2026-08-05 用户明确要求）**：严格跟手册一阶段一停，我讲解 + 给代码块，
**由用户自己敲、自己跑命令**，我只盯错和验收。不要提前替他把后面的阶段做完。

| 阶段 | 内容 | 状态 |
|---|---|---|
| 00① | MetaMask + 切到 Sepolia | ✅ |
| 00② | 领测试币 0.05 SepoliaETH | ✅ |
| 00③ | Alchemy RPC | ✅ 已验证 chainId 11155111 |
| 00④ | Etherscan API Key | ✅ 已验证可查 Sepolia |
| 00⑤ | Reown Project ID | ✅ 2026-08-08 建成。Team `kashen` / project `onchain-notepad`，ID 头尾 `5868…c310`，完整值在用户手上，填进 `web/.env.local` 的 `VITE_WC_PROJECT_ID`。名额已用满（0 left），**别删** |
| 01 | 初始化 Hardhat 2 | ✅ |
| 02 | 编写 Notepad.sol | ✅ 编译通过 |
| 03 | 本地测试 | ✅ 5 passing |
| 04 | 部署到 Sepolia | ✅ |
| 05 | Etherscan 开源验证 | ✅ 绿勾 |
| 06 | Vite + React 脚手架 | ✅ 2026-08-08 验收通过 |
| 07 | wagmi + RainbowKit | ✅ 2026-08-08 连上 MetaMask，显示地址 + 0.049 ETH，中文暗色弹窗正常 |
| 08 | 读合约（笔记列表） | ✅ 2026-08-08 显示「还没有笔记」= 读到空数组，成功 |
| 09 | 写合约（新增笔记） | ✅ 2026-08-08 闭环打通，链上 `noteCount`=1（公共 RPC 独立核验） |
| 10 | 收尾打磨 | ✅ UI（赛博风）+ 网络守卫 + 删除功能 + README + GitHub 仓库 + 部署上线，全部完成 |

## 交付物（2026-08-08 全部就绪）

- **在线站点**：<https://kashen336699-ks.github.io/onchain-notepad/>（GitHub Pages，Actions 自动部署）
- **代码仓库**：<https://github.com/kashen336699-ks/onchain-notepad>（Public）
- **合约**：<https://sepolia.etherscan.io/address/0x29Ddd31020283160cF31b2B9ff207b9b4cB7025F#code>（Exact Match）
- 部署机制：push 到 `main` → Actions 跑 `web/` 的 `npm ci && npm run build` → 发布 `web/dist`
- `VITE_WC_PROJECT_ID` 存在仓库 Actions secret 里；`vite.config.ts` 的 `base`
  用 `process.env.GITHUB_ACTIONS` 判断，CI 里是 `/onchain-notepad/`，本地仍是 `/`

## 作业 6 项要求的完成情况

| # | 要求 | 状态 |
|---|---|---|
| 1 | Vite + React 前端 | ✅ 阶段 06 完成 |
| 2 | 前端使用 wagmi | ⬜ 阶段 07–09 |
| 3 | 合约部署 Sepolia + 水龙头 + Hardhat | ✅ |
| 4 | 测试链合约开源验证 | ✅ |
| 5 | 用 RainbowKit | ⬜ 阶段 07 |
| 6 | 完成前后端交互逻辑 | ⬜ 阶段 08–09 |

## 关键地址

- **合约地址**：`0x29Ddd31020283160cF31b2B9ff207b9b4cB7025F`
- **Etherscan（已验证源码）**：https://sepolia.etherscan.io/address/0x29Ddd31020283160cF31b2B9ff207b9b4cB7025F#code
- **作业钱包**：`0xA5e703330f9aC96e7304aB642731630745df747f`
- **余额**：0.049444 ETH（部署花了 0.000556）
- **网络**：Sepolia，chainId `11155111`

## 已有文件

```
onchain-notepad/
├── contract/
│   ├── contracts/Notepad.sol        合约源码
│   ├── test/Notepad.test.js         5 个测试用例
│   ├── scripts/deploy.js            部署 + 自动导出 ABI 给前端
│   ├── hardhat.config.js            Solidity 0.8.24 + Sepolia + Etherscan
│   ├── .env                         ⚠️ 含私钥，已在 .gitignore，绝不提交
│   └── .env.example                 模板
└── web/src/contracts/notepad.ts     部署脚本自动生成的地址 + ABI
```

## 回看验收进度：01–05 全部完成 ✅（2026-08-05 开始，2026-08-06 收工）

代码不重写，只讲解 + 由用户亲手跑命令验收。

| 阶段 | 回看状态 |
|---|---|
| 01 初始化 Hardhat | ✅ `npx hardhat --version` = 2.29.0；`clean` + `compile` 出 `(evm target: paris)` |
| 02 编写 Notepad.sol | ✅ 逐段讲完（struct / mapping / event / require / storage vs memory / view） |
| 03 本地测试 | ✅ `5 passing`，三个破坏实验全部做完（见下） |
| 04 部署 | ✅ 讲完 deploy.js 三段；用 `hardhat console --network sepolia` 实测：chainId `11155111n`、`getCode(...).length` = **4120**（= 2059 字节 runtime code）、`noteCount(钱包)` = `0n` |
| 05 Etherscan 验证 | ✅ 页面确认 `Source Code Verified` + **Exact Match**、`v0.8.24+commit.e11b9ed9`、`Yes with 200 runs`、`paris EvmVersion`，Read Contract 查 `noteCount` = 0 |

### 三个破坏实验的实测结果（已全部复原）

| 实验 | 改动 | 结果 | 建立的认知 |
|---|---|---|---|
| ① | `deleteNote` 里 `Note storage` → `Note memory` | **编译零警告通过**，4 passing / 1 failing，`AssertionError: expected false to equal true` | 编译器不会救你，测试才是检测仪；这类 bug 上链后交易全绿但什么也没发生 |
| ② | `<= 280` → `<= 5` | 2 passing / **3 failing**，全是 `reverted with reason string 'content too long'` | `addNote` 是地基，3、4 号用例只是**铺场景**时调了它就一起塌；`bytes().length` 数**字节**不是字符（汉字 3 字节，所以 280 其实只有 93 个汉字）；`hello` 正好 5 字节压线过 |
| ③ | 测试里加临时用例：`connect(other).getNotes(owner.address)` | **读到了 1 条，内容全文可见**；读 `other` 自己的地址 = 0 | mapping 隔离的是**写**（`msg.sender` 伪造不了），**读完全公开**。`getNotes(address)` 按参数查槽，不看调用者 |

实验 ② 附带发现：报错栈里的 `contracts/Notepad.sol:39` **行号是错的**（require 实际在 32 行），
optimizer 开着时 source map 会飘——**可靠信号是 reason string**，所以每个 require 都要写有意义的说明。

留作练习（还没做）：现有 5 个用例**没覆盖** 280 字节上限、`note not found`、`already deleted` 这三个 require，可让用户自己补用例。

## 阶段 06 已完成（2026-08-08 验收）

验收三条全过：dev server 起在 5173、默认页正常渲染、`Count is 0` 点得动。
额外做了 HMR 实验：改 `App.tsx` 的 `<h1>` 为「链上记事本」，保存后**页面不刷新、计数器不归零**，
建立的认知是 HMR 只替换改动的模块 —— 阶段 09 调 UI 时不用反复重连 MetaMask。

- 命令：`npm create vite@latest web -- --template react-ts`（用的 `create-vite@9.1.2`）
- 装完实测：`node_modules` 107 个包，Node v20.19.6 / npm 10.8.2，Vite 8 / React 19 / TS 6
- 三个交互选项的正确选法（这版比手册里写的多问了两个）：
  1. `Target directory "web" is not empty` → **`Ignore files and continue`**（选 `Remove existing files` 会删掉 notepad.ts）
  2. `Which linter to use?` → **ESLint**（Oxlint 也能用，但教程/报错资料少；ESLint 的 `react-hooks/exhaustive-deps` 对后面写 wagmi hooks 有帮助）
  3. `Install with npm and start now?` → **Yes**（装完自动 `npm run dev`）
- ✅ `web/src/contracts/notepad.ts` 确认存活（2834 字节，`Aug 4 08:20` 未被覆盖）
  另有备份 `class9/notepad.ts.bak`，脚手架跑完确认无误后可删
- 脚手架文件已落盘：`package.json` / `vite.config.ts` / `eslint.config.js` / `index.html` / `src/` / `tsconfig*.json`

### 下次继续：只剩 3 件事（2026-08-08 暂停于此）

**作业本身已经可以交了**，下面都是加分项／收尾。

**① Cloudflare Pages 备用域名（进行到一半，用户去吃早饭了）**

为什么要加：GitHub Pages 的链接在国内可能打不开。实测他这台机器 DNS 解析
`kashen336699-ks.github.io` 得到 `198.18.0.19`（Clash/TUN 的 fake-ip 段），
说明**全程走代理**，直连能否访问未知。同学用 `pages.dev` 大概率就是这个原因。

走 Dashboard 网页版，**不要再试 wrangler CLI**：`wrangler@4.120` 要求 Node ≥22，
他是 v20.19.6，`npx wrangler login` 下了半天还没跑起来，已放弃并 kill 掉。

他的 Cloudflare 账号 `Kashen336699@g...`，已登录，account id `48b1a6f3578ef8e8d9d3b0d8c1e4fc6c`，
名下有域名 `sfaigc.com`。给他的步骤：
Compute → Workers & Pages → Create → Pages → Connect to Git → 授权 GitHub App
（选 Only select repositories，只勾 onchain-notepad）→ Begin setup，构建配置：

| 字段 | 值 |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| **Root directory** | **`web`** ← 漏了必挂，仓库根目录没有 package.json |
| 环境变量 | `VITE_WC_PROJECT_ID` = 那串 32 位 ID |

**代码不用改**：`vite.config.ts` 的 base 是 `process.env.GITHUB_ACTIONS ? '/onchain-notepad/' : '/'`，
Cloudflare 上没有 `GITHUB_ACTIONS` 变量 → 自动走根路径，正好匹配 `pages.dev`。两边可并存。

部署完拿到 `xxx.pages.dev` 后要做：验证资源路径 + 钱包连接、更新 README 和本文件。

**② 录屏**（只有他能做）—— 含 MetaMask 弹窗和交易确认的完整操作。

**③ Etherscan 验证页截图**（只有他能做）—— 那个绿色 ✓ 和源码页。

### 阶段 07 讲解要点（已在等待期间讲过，接手时可复用）

- **三层积木**：RainbowKit（连钱包弹窗 UI）→ wagmi（React hooks 读写合约）→ viem（编解码）
  → Connector（injected 插件 / WalletConnect 扫码，后者才要 Reown ID）→ Transport（Alchemy RPC）
  三者是叠加关系不是平行选项；三个都不装也能做 DApp，只是要多写代码
- **读 vs 写**：`useReadContract` 走 Alchemy、免费、不用连钱包不用签名；
  `useWriteContract` 必须钱包签名、走钱包自己的 RPC、花 gas、要处理等待/失败/用户取消
- **Provider 必须套三层且顺序不能错**：`WagmiProvider` > `QueryClientProvider` > `RainbowKitProvider`
  （wagmi 底层用 TanStack Query 做缓存；RainbowKit 要读 wagmi 的连接状态）
- **`VITE_` 前缀 = 公开发布**：Vite 只把 `VITE_` 开头的变量打进前端，而打进去的东西 F12 就能看到。
  Reown ID 可以公开（靠域名白名单防滥用），**`PRIVATE_KEY` 永远不许进 `web/`，更不能加 `VITE_` 前缀**

## 环境补充（2026-08-05）

- **VS Code Solidity 扩展已装**：`nomicfoundation.hardhat-solidity` v0.8.29（Hardhat 官方出的，比 JuanBlanco 那个更适配本项目，两个别同时装）。
  命令行装的，**当前窗口需要 `Cmd+Shift+P` → Developer: Reload Window 才生效**，用户还没验证 Cmd+点击跳转是否可用。
  装之前用户完全没有 Solidity 扩展，所以 Cmd+点击跳声明一直没反应——不是配置问题，是缺扩展。
- **Hardhat 遥测已永久关闭**：`~/Library/Preferences/hardhat-nodejs/telemetry-consent.json` = `{"consent": false}`
- **新增学习页**：`class9/项目结构解剖.html`（单文件 32KB，离线可看，跟开发手册放一起）。
  内容：文件三分类（要懂/不用读/知道就行）、项目分阶段生长时间线、Notepad.sol 逐段拆解、三个破坏实验、五道自测题。
  数据都是实测的：node_modules 480MB / 399 个包，手写代码 178 行（Notepad.sol 66 + test 49 + deploy 39 + config 24）。

## 这次踩到的坑（手册里没写的）

1. **solc 编译器下载极慢**
   Hardhat 首次 `compile` 要下 79MB 的 solc 二进制，单线程只有 ~14KB/s（要 94 分钟）。
   解决：分块 16 连接并行下载能到 277KB/s，脚本见对话记录。编译器全局缓存在
   `~/Library/Caches/hardhat-nodejs/compilers-v2/`，**以后所有 Hardhat 项目都不用再下**。

2. **MetaMask "显示测试网络" 换位置了**
   手册写的「设置 → 高级」在新版已不存在。新路径：**☰ → 设置 → 管理网络 → 拉到底**。
   而且 onboarding 没走完（没点「打开钱包」）时这个开关是**灰的、点不动**。

3. **MetaMask 导出的私钥不带 `0x`**
   Hardhat 要求带。不补前缀报 `invalid private key`，报错完全不提示缺前缀。

4. **Etherscan 的 "API Keys" 改名叫 "API Dashboard"**

5. **钱包显示的余额 ≠ 链上真实状态**
   MetaMask 界面会缓存旧数据。判断到账要用 `eth_getBalance` 直接查链。

6. **终端里千万别一次粘贴多行命令**
   粘贴的换行会被交互式提示（如 Hardhat 的 Y/n 遥测询问）当成回答吃掉，导致「自动选了 y」。
   这个坑在这次回看里连续踩了 3 次。**一条一条敲，等上一条跑完再敲下一条。**

7. **Reown Dashboard 的坑**
   - 新账号必须先建 Team 才能建 Project，手册直接从 New Project 讲起，中间少了一段引导流程
   - **Dashboard 的报错弹窗完全不可信，成没成一律看刷新后的列表。** 踩了两次：
     8-5 弹 `An unexpected response was received from the server`（结果没建成，8-8 复查是 0 projects）；
     8-8 弹 `You've reached your project limit`（结果**建成功了**，刷新后列表里有）。
     两次报错内容不同、真假相反，唯一可靠的判断是**关弹窗 → 刷新 → 数列表**。
   - 免费 Starter 版**只有 1 个 project 名额**，2026-08-08 已用满（0 left），别删了重建
   - 新版建 Project 只问名字，没有 AppKit / WalletKit 的选择项了

8. **VS Code 扩展从 marketplace 下载同样极慢**
   `code --install-extension` 跑了十几分钟才完成（境外链路），跟下 solc 一个毛病。
   界面里装能看到进度条，比命令行体感好。

9. **`npm install` 卡在 "Installing dependencies with npm..." 一动不动，别以为是死了**
   Vite 脚手架那次跑了 30+ 分钟。诊断方法（不要 Ctrl+C，中断会留下残缺依赖树）：
   - `ps -p <pid> -o etime,command` —— 进程在不在、跑了多久
   - CPU 占用低（0.x%）= 在等网络，不是卡死
   - **`node_modules` 为空不代表没进展**：npm 先把包下到全局缓存 `~/.npm/_cacache`，
     最后一步才一次性铺进 `node_modules`，所以现象是「憋很久然后突然完成」
   - 判断在不在动：隔 30 秒量两次 `du -sk ~/.npm/_cacache`，有增长就是在下
   本机实测约 100 KB/s。registry 早就是 `https://registry.npmmirror.com` 了，没得再优化，只能等。

## 安全检查

- `.env` 已在 `contract/.gitignore` 里
- 作业钱包是全新账户，只有测试币
- 提交前记得跑：`git status --short | grep -i env`（应该没有输出）
