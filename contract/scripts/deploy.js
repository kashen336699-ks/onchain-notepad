const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log("部署账户:", deployer.address);
  console.log("账户余额:", hre.ethers.formatEther(balance), "ETH");

  const Notepad = await hre.ethers.getContractFactory("Notepad");
  const notepad = await Notepad.deploy();
  await notepad.waitForDeployment();

  const address = await notepad.getAddress();
  console.log("✅ Notepad 已部署到:", address);

  // —— 自动导出给前端 ——
  const artifact = await hre.artifacts.readArtifact("Notepad");
  const outDir = path.join(__dirname, "../../web/src/contracts");
  fs.mkdirSync(outDir, { recursive: true });

  // 写成 .ts 并加 as const，wagmi 才能推导出完整类型
  const ts =
`// 由 scripts/deploy.js 自动生成，请勿手动修改
export const NOTEPAD_ADDRESS = "${address}" as const;

export const NOTEPAD_ABI = ${JSON.stringify(artifact.abi, null, 2)} as const;
`;

  fs.writeFileSync(path.join(outDir, "notepad.ts"), ts);
  console.log("✅ ABI 已导出到 web/src/contracts/notepad.ts");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
