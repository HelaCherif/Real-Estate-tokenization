import {useAccount} from 'wagmi'
import {Alert, AlertIcon, Box, Button} from '@chakra-ui/react'
import Layout from "../components/Layout/Layout";
import Link from "next/link";
import Table1 from "../components/Layout/Table";
import {useEffect, useState} from "react";
import {Account} from "../components/Header/Account";

export default function Home() {

    const [isConnected, setIsConnected] = useState(false);
    const [propertiesEvents, setPropertiesEvents] = useState([]);
    const [id, setId] = useState("1");
    const {address,signer} = useAccount();

    useEffect(() => {
        setIsConnected(!!address);
    }, [address]);

    return (
        <>
            <Account/>
            <Layout>
                {isConnected ? (
                    <Box>
                        <Button><Link href="/RealEstateForm">Add new property</Link></Button>
                        <Table1/>
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
    )
}
