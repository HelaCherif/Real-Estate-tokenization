import {useAccount, useContractRead} from 'wagmi'
import {Alert, AlertIcon, Box, Button} from '@chakra-ui/react'
import Layout from "../components/Layout/Layout";
import Link from "next/link";
import Table from "../components/Layout/Table";
import {useEffect, useState} from "react";
import {abi, propertiesAddress} from "../abi/RealEstate";

export default function Home() {

    const [isConnected, setIsConnected] = useState(false);
    const {address} = useAccount();

    useEffect(() => {
        setIsConnected(!!address);
    }, [address]);

    const creator1 = useContractRead({
        address: propertiesAddress,
        abi: abi,
        chainId: 31337,
        functionName: "creator"
    });

    return (
        <>
            <Layout>
                {isConnected ? (
                    <Box>
                        <Button hidden={creator1.data !== address}><Link href="/RealEstateForm">Add new property</Link></Button>
                        <Table address={address}/>
                    </Box>

                ) : (
                    <div>
                        <Alert status='warning' width="50%">
                            <AlertIcon/>
                            Please, connect your Wallet!
                        </Alert>
                    </div>
                )}
            </Layout>
        </>
    );
}
