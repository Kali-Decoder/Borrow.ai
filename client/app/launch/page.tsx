"use client";
import { ConnectButton } from "thirdweb/react";
import { Tabs, Tab, Card, Input, CardBody, Button } from "@nextui-org/react";

import { client } from "../client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "@/node_modules/axios/index";
import { useRouter } from "next/navigation";
type Props = {};

function Feed({}: Props) {
  const [userLendData, setUserLendData] = useState({
    lentTokenAddress: "",
    collateralTokenAddress: "",
  });

  const [userBorrowData, setUserBorrowData] = useState({
    borrowedTokenAddress: "",
    collateralTokenAddress: "",
  });

  const handleGo = async () => {
    console.log("Go clicked");
    console.log(userLendData);
    console.log(userBorrowData);
  };

  async function checkReserveExists(asset: any, poolAddress: any) {
    let poolAdr = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";
    let asset1 ="0xd586E7F844cEa2F87f50152665BCbc2C279D8d70";
    let id = toast.loading("Checking reserve existence...");
    try {
      let response = await axios.get(
        `https://borrow-ai.vercel.app/api/reserve-exists/0xd586E7F844cEa2F87f50152665BCbc2C279D8d70/0x794a61358D6845594F94dc1DB02A252b5b4814aD`
      );
      if (response?.data?.exists) {
        toast.success("Reserve exists!", { id });
        router.push(`/lend`);
      } else {
        toast.error("Reserve does not exist!", { id });
      }
      return response?.data?.exists;
    } catch (error: any) {
      console.error("Error checking reserve existence:", error.message);
      throw error;
    }
  }
  async function checkReserveExistsBorrow(asset: any, poolAddress: any) {
    let poolAdr = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";
    let id = toast.loading("Checking reserve existence...");
    try {
      const response = await axios.get(
        `https://borrow-ai.vercel.app/api/reserve-exists/${asset}/${poolAdr}`
      );

      console.log(response, "Response");
      if (response?.data?.exists) {
        toast.success("Reserve exists!", { id });
        router.push(`/borrow`);
      } else {
        toast.error("Reserve does not exist!", { id });
      }
      return response?.data?.exists;
    } catch (error: any) {
      console.error("Error checking reserve existence:", error.message);
      throw error;
    }
  }
  const router = useRouter();
  return (
    <div className="w-full">
      <Toaster />
      <div className="flex w-full items-center justify-between gap-12 px-4 py-2">
        <button className="p-3 bg-black text-white text-2xl rounded-lg font-bold uppercase cursor-pointer">
          <a href="/">Launch Borrow.Ai</a>
        </button>
        <div>
          <ConnectButton client={client} />
        </div>
      </div>
      <div className="w-full h-[80vh] flex justify-center items-center">
        <div className="flex w-1/3 flex-col">
          <Tabs
            key="lend"
            aria-label="Dynamic tabs"
            color="success"
            radius="full"
          >
            <Tab key="lend" title="Lend">
              <Card>
                <CardBody className="px-8 py-10 gap-y-4">
                  <h1 className="font-bold text-xl">
                    Lend your money to the borrowers and earn interest
                  </h1>
                  <Input
                    autoFocus
                    label="Lent Token Address"
                    placeholder="0xabvcd123445..."
                    variant="bordered"
                    type="text"
                    value={userLendData.lentTokenAddress}
                    onChange={(e: any) =>
                      setUserLendData({
                        ...userLendData,
                        lentTokenAddress: e.target.value,
                      })
                    }
                  />

                  <Input
                    autoFocus
                    label="Collateral Token Address"
                    placeholder="0x5677788..."
                    variant="bordered"
                    type="text"
                    value={userLendData.collateralTokenAddress}
                    onChange={(e: any) =>
                      setUserLendData({
                        ...userLendData,
                        collateralTokenAddress: e.target.value,
                      })
                    }
                  />

                  <Button
                    onClick={async () => {
                      handleGo();
                      let result = await checkReserveExists(userLendData.lentTokenAddress,userLendData.collateralTokenAddress);
                      console.log(result,"Result");
                    }}
                    color="warning"
                    variant="faded"
                  >
                    Go
                  </Button>
                </CardBody>
              </Card>
            </Tab>

            <Tab key="borrow" title="Borrow">
              <Card>
                <CardBody>
                  <CardBody className="px-8 py-10 gap-y-4">
                    <h1 className="font-bold text-xl">
                      Borrow your money to the Lenders and earn interest
                    </h1>
                    <Input
                      autoFocus
                      label="Borrow Token Address"
                      placeholder="0xabvcd123445..."
                      variant="bordered"
                      value={userBorrowData.borrowedTokenAddress}
                      onChange={(e: any) => {
                        setUserBorrowData({
                          ...userBorrowData,
                          borrowedTokenAddress: e.target.value,
                        });
                      }}
                      type="text"
                    />

                    <Input
                      autoFocus
                      label="Collateral Token Address"
                      placeholder="0x5677788..."
                      variant="bordered"
                      type="text"
                      value={userBorrowData.collateralTokenAddress}
                      onChange={(e: any) => {
                        setUserBorrowData({
                          ...userBorrowData,
                          collateralTokenAddress: e.target.value,
                        });
                      }}
                    />

                    <Button  onClick={async () => {
                      handleGo();
                      let result = await checkReserveExistsBorrow(userBorrowData.borrowedTokenAddress,userBorrowData.collateralTokenAddress);
                      console.log(result,"Result");
                    }} color="warning" variant="faded">
                      Go
                    </Button>
                  </CardBody>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Feed;
