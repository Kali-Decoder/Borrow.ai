"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Button,
  Input,
} from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { prepareContractCall } from "thirdweb";
import { client } from "../client";
import {
  useSendTransaction,
  ConnectButton,
  ConnectEmbed,
  useActiveAccount,
} from "thirdweb/react";
import { useRouter } from "next/navigation";
export default function Lend() {
  const { mutate: sendTransaction } = useSendTransaction();
  const [poolsData, setPoolsData] = useState<string[]>([]);
  const [poolsAddresses, setPoolsAddresses] = useState<unknown[]>([]);
  const account = useActiveAccount();
  console.log(account, "account");
  const router = useRouter();
  const [poolClickData, setPoolClickData] = useState({
    asset: "",
    tokens: [],
    liquidityIndex: "",
    currentLiquidityRate: "",
    currentStableBorrowRate: "",
    accruedToTreasury: "",
  });
 
  useEffect(() => {
    (async () => {
      let id = toast.loading("Fetching Pools...");
      let poolAddress = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";
      const response = await axios.get(
        `https://borrow-ai.vercel.app/api/reserves/${poolAddress}`
      );
      function separateKeysAndValues(obj:any) {
        const keys = Object.keys(obj);
        const values = Object.values(obj);

        return { keys, values };
      }
      const { keys, values } = separateKeysAndValues(response?.data);
      setPoolsAddresses(values);
      setPoolsData(keys);
      toast.success("Pools fetched!", { id });
    })();
    // fetchData("0xd586E7F844cEa2F87f50152665BCbc2C279D8d70","0x794a61358D6845594F94dc1DB02A252b5b4814aD");
  }, []);

  const handlePoolClick = async (asset: any) => {
    let id = toast.loading("Fetching Pool Details...");
    let poolAddress = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";
    try {
      let response = await axios.get(
        `https://borrow-ai.vercel.app/api/get-pool-details/${asset}/${poolAddress}`
      );
      console.log(response?.data);
      setPoolClickData(response?.data);

      toast.success("Here are Details !", { id });
    } catch (error) {
      console.log(error);
      toast.error("Error fetching pool details", { id });
    }
  };
  return (
    <>
      <Toaster />
      <div className="flex mx-auto justify-center gap-8 items-center w-full h-[100vh] border-4 border-yellow-600">
        <Card className="w-[400px]">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">Lend Card</p>
            </div>
          </CardHeader>
          <Divider />
          <ConnectButton client={client} />
          <CardBody className="gap-y-4 px-4 py-8">
            <Input
              type="number"
              label="APY"
              disabled
              placeholder="0.00"
              value={poolClickData?.currentLiquidityRate}
              labelPlacement="outside"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
            />
            <Input
              type="number"
              label="Collateral <> Liquidity"
              placeholder="0.00"
              disabled
              labelPlacement="outside"
              value={poolClickData?.currentStableBorrowRate}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
            />
            <Input
              type="number"
              label="Risk"
              placeholder="0.00"
              labelPlacement="outside"
              disabled
              value={poolClickData?.accruedToTreasury}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
            />
          </CardBody>
          <Divider />
          <CardFooter>
            <Button  onClick={()=>{
             let id =  toast.loading("Position is creating ...",{
                duration: 20000
             });

             toast.success("Position created successfully",{id});

             router.push("/sucess");
            }} color="success">
              Create Position
            </Button>
          </CardFooter>
        </Card>
        <Card className="w-[400px]">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">Fetching your Lend Pools...</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="gap-y-4 px-4 py-8">
            <div className="flex flex-wrap gap-4 items-center">
              {poolsData.length > 0 &&
                poolsData.map((pool, i) => (
                  <>
                    <Button
                      onClick={() => handlePoolClick(poolsAddresses[i])}
                      color="warning"
                    >
                      {pool}
                    </Button>
                  </>
                ))}
            </div>
          </CardBody>
          <Divider />
        </Card>
      </div>
    </>
  );
}
