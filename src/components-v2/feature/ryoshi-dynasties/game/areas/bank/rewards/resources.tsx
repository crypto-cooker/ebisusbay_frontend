import React, {useState} from "react";
import {useAppSelector} from "@src/Store/hooks";
import {Contract, ethers} from "ethers";
import Bank from "@src/Contracts/Bank.json";
import {useQuery} from "@tanstack/react-query";
import {Box, Center, Spinner, Text} from "@chakra-ui/react";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {appConfig} from "@src/Config";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);

const ResourcesTab = () => {
  // const [isExecuting, setIsExecuting] = useState(false);
  // const user = useAppSelector((state) => state.user);

  // const [hasDeposited, setHasDeposited] = useState(false);
  // const [amountDeposited, setAmountDeposited] = useState(0);
  // const [depositLength, setDepositLength] = useState(0);
  // const [withdrawDate, setWithdrawDate] = useState<string>();
  // const [executingLabel, setExecutingLabel] = useState('Staking...');

  // const checkForDeposits = async () => {
  //   const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
  //   const bank = new Contract(config.contracts.bank, Bank, readProvider);
  //   return [];
  // }
  //
  // const { error, data: deposits, status, refetch } = useQuery(
  //   ['BankDeposits', user.address],
  //   checkForDeposits,
  //   {
  //     enabled: !!user.address,
  //     refetchOnWindowFocus: false
  //   }
  // );

  return (
    <RdModalBox textAlign='center'>
      Coming Soon
    </RdModalBox>
  )
}

export default ResourcesTab;