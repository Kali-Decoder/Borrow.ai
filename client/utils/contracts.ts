import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { sepolia, arbitrum, avalanche } from "thirdweb/chains";

export const getContractInstance = async (address:any) => {
  return getContract({
    client: client,
    chain: [sepolia, arbitrum, avalanche],
    address: address,
  });
};
