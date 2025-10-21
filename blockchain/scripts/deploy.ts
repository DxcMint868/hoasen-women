import { ethers } from "hardhat";
import { tryVerifyContractOnExplorer } from "./verify";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Replace with actual USDT and NFT contract addresses for Base Sepolia
  const usdtAddress =
    process.env.USDT_ADDRESS || "0x0000000000000000000000000000000000000000";
  const nftAddress =
    process.env.NFT_ADDRESS || "0x0000000000000000000000000000000000000000";

  const HoasenGiftRedemption = await ethers.getContractFactory(
    "HoasenGiftRedemption"
  );
  const contract = await HoasenGiftRedemption.deploy(usdtAddress, nftAddress);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("HoasenGiftRedemption deployed to:", contractAddress);

  await tryVerifyContractOnExplorer(contractAddress, [usdtAddress, nftAddress]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
