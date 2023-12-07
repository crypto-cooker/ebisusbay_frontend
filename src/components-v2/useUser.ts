import {useAccount, useBalance, useDisconnect, useNetwork} from "wagmi";
import {useEffect, useState} from "react";
import {appConfig} from "@src/Config";
import {getProfile} from "@src/core/cms/endpoints/profile";
import {useQuery} from "@tanstack/react-query";
import {multicall} from "@wagmi/core";
import {portABI, stakeABI} from "@src/Contracts/types";
import {ethers} from "ethers";
import {useWeb3ModalProvider} from "@web3modal/ethers5/react";
import {getThemeInStorage} from "@src/helpers/storage";

const config = appConfig();

export const useUser = () => {
    const { address, isConnecting, isConnected } = useAccount();
    const { chain, chains } = useNetwork();
    const { disconnect: disconnectWallet } = useDisconnect();
    const [correctChain, setCorrectChain] = useState(false);
    const croBalance = useBalance({
        address: address,
    });
    const frtnBalance = useBalance({
        address: address,
        token: config.tokens.frtn.address
    });

    const [escrowBalance, setEscrowBalance] = useState(0);
    const [usesEscrow, setUsesEscrow] = useState(false);
    const [stakingRewards, setStakingRewards] = useState(0);
    const [initializing, setInitializing] = useState(false);

    // Legacy functions from old redux store to deprecate
    const provider = useLegacyProviderFunctions();

    const {data: profile} = useQuery({
        queryKey: ['UserProfile', address],
        queryFn: () => getProfile(address),
        enabled: !!address,
    });

    useEffect(() => {
        setCorrectChain(isConnected && !!chain && chain.id === parseInt(config.chain.id));
        if (isConnected) initialize();
    }, [address, isConnected, chain]);

    const initialize = async () => {
        if (!address) return;
        try {
            setInitializing(true);
            const data = await multicall({
                contracts: [
                    {
                        address: config.contracts.market,
                        abi: portABI,
                        functionName: 'isMember',
                        args: [address],
                    },
                    {
                        address: config.contracts.market,
                        abi: portABI,
                        functionName: 'useEscrow',
                        args: [address],
                    },
                    {
                        address: config.contracts.market,
                        abi: portABI,
                        functionName: 'payments',
                        args: [address],
                    },
                    {
                        address: config.contracts.market,
                        abi: portABI,
                        functionName: 'fee',
                        args: [address],
                    },
                    {
                        address: config.contracts.stake,
                        abi: stakeABI,
                        functionName: 'getReward',
                        args: [address],
                    },
                ],
            });
            setUsesEscrow(data[1].result ?? false);
            setEscrowBalance(parseInt(ethers.utils.formatEther(data[2].result ?? 0)));
            setStakingRewards(parseInt(ethers.utils.formatEther(data[4].result ?? 0)));
        } catch (e) {
            console.log(e);
        } finally {
            setInitializing(false);
        }
    }


    const disconnect = () => {
        disconnectWallet();
        localStorage.clear();
        // TODO: reset all other state from User.ts
    }

    const theme = getThemeInStorage();

    return {
        wallet: {
            address,
            isConnecting,
            isConnected,
            correctChain,
        },
        profile: profile?.data ?? {},
        balances: {
            cro: croBalance.data?.formatted ?? 0,
            frtn: frtnBalance.data?.formatted ?? 0,
            staking: stakingRewards
        },
        escrow: {
            enabled: usesEscrow,
            balance: escrowBalance
        },
        initializing,
        disconnect,

        // Legacy
        address,
        provider,
        theme
    }
}

const useLegacyProviderFunctions = () => {
    const { walletProvider } = useWeb3ModalProvider();

    const getSigner = () => {
        if (!walletProvider) return;

        return new ethers.providers.Web3Provider(walletProvider)
    }

    return {
        getSigner
    }
}