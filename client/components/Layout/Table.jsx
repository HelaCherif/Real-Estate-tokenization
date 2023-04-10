import {Button, Card, CardBody, CardFooter, CardHeader, Heading, SimpleGrid, Text} from "@chakra-ui/react";
import {DeleteIcon, EditIcon, ExternalLinkIcon} from '@chakra-ui/icons'
import {useAccount, useContractWrite, usePrepareContractWrite, useProvider} from 'wagmi'
import {abi} from "../../abi/RealEstate.js";
import {useEffect, useState} from "react";
import {getContract} from '@wagmi/core'


function Table1() {
    const [isConnected, setIsConnected] = useState(false);
    const [propertiesEvents, setPropertiesEvents] = useState([]);

    const {address, signer} = useAccount();
    const provider = useProvider();
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

    const contract = getContract({
        address: contractAddress,
        abi: abi,
        signerOrProvider: provider
    })

    function deleteProperties(id) {
        write?.({
            recklesslySetUnpreparedArgs: id
        })
    }

    const {config} = usePrepareContractWrite({
        address: contractAddress,
        abi: abi,
        chainId: 31337,
        functionName: 'deleteProperty',
        signerOrProvider: provider,
        args: []
    })


    const {write} = useContractWrite(config);


    useEffect(() => {
        async function getProperties() {
            if (contract) {
                const filter = contract.filters.PropertyAdded();
                await contract.queryFilter(filter).then((data) => {
                    data.map(d => {
                        let arg = d.args.toString().split(',');
                        if (!propertiesEvents.find(v => v.id === arg[0])) {
                            setPropertiesEvents([
                                ...propertiesEvents,
                                {id: arg[0], name: arg[1], price: arg[2], addr: arg[3], tokenNumber: arg[4]}
                            ])
                        }

                    })
                });
            }
        }
        async function deleteProperties() {
            if (contract && propertiesEvents.length > 0) {
                const filter = contract.filters.PropertyDeleted();
                await contract.queryFilter(filter).then((data) => {
                    data.map(d => {
                        let prop = propertiesEvents.find(e => e.id === d.args)
                        let index = propertiesEvents.indexOf(prop);
                        propertiesEvents.splice(index, 1)
                    })
                });
            }
        }


        getProperties();
        deleteProperties();
    })

    return (
        <SimpleGrid spacing={6}>

            {propertiesEvents ? propertiesEvents.map((item) => {
                console.log(propertiesEvents);
                return (<Card key={item.id}>
                    <CardHeader>
                        <Heading size='md'>{item.name}</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>{item.addr}</Text>
                    </CardBody>
                    <CardFooter
                        justify='space-between'
                        flexWrap='wrap'
                        sx={{
                            '& > button': {
                                minW: '136px',
                            },
                        }}
                    >
                        <Button flex='1' variant='ghost' leftIcon={<EditIcon/>}>
                            Modifier
                        </Button>
                        <Button flex='1' variant='ghost' leftIcon={<ExternalLinkIcon/>}>
                            Publier
                        </Button>
                        <Button flex='1' variant='ghost' leftIcon={<DeleteIcon/>} disabled={!write} onClick={() => write?.({
                                recklesslySetUnpreparedArgs: item.id
                            })}>
                            Supprimer
                        </Button>
                    </CardFooter>
                </Card>)
            }) : <></>}


        </SimpleGrid>
    )
}

export default Table1;