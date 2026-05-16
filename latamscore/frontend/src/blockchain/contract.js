import { ethers } from "ethers";
import { ABI } from "./abi";

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export async function getContract() {

  if (!window.ethereum) {
    throw new Error("MetaMask no detectado");
  }

  await window.ethereum.request({
    method: "eth_requestAccounts"
  });

  const provider =
    new ethers.BrowserProvider(window.ethereum);

  const signer =
    await provider.getSigner();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    signer
  );
}