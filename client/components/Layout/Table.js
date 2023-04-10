import {Button, Card, CardBody, CardFooter, CardHeader, Heading, SimpleGrid, Text, useToast} from "@chakra-ui/react";
import {DeleteIcon, ExternalLinkIcon} from '@chakra-ui/icons';
import {useContractRead, useContractWrite, usePrepareContractWrite, useProvider} from 'wagmi'
import {abi, propertiesAddress} from "../../abi/RealEstate.js";
import {useEffect, useState} from "react";
import {getContract} from '@wagmi/core'
import {BigNumber, ethers} from "ethers";


function Table({address}) {
    const [properties, setProperties] = useState([]);
    const [tokens, setTokens] = useState([]);
    const [deletedId, setDeletedId] = useState('');
    const [updatedId, setUpdatedId] = useState('');
    const [mintId, setMintId] = useState('');
    const [transferTokenId, setTransferTokenId] = useState('');
    const provider = useProvider();
    const contract = getContract({
        address: propertiesAddress,
        abi: abi,
        signerOrProvider: provider
    })
    const toast = useToast();


    const contractRead = useContractRead({
        address: propertiesAddress,
        abi: abi,
        chainId: 31337,
        functionName: "getAllProperties",
        watch: true,
    });

    const contractReadToken = useContractRead({
        address: propertiesAddress,
        abi: abi,
        chainId: 31337,
        functionName: "getAllTokens",
        watch: true,
    });

    const creator1 = useContractRead({
        address: propertiesAddress,
        abi: abi,
        chainId: 31337,
        functionName: "creator"
    });

    const {config: deleteConfig} = usePrepareContractWrite({
        address: propertiesAddress,
        abi: abi,
        chainId: 31337,
        functionName: 'deleteProperty',
        signerOrProvider: provider,
        args: [deletedId],
        enabled: Boolean(deletedId)
    })

    const {config: publishConfig} = usePrepareContractWrite({
        address: propertiesAddress,
        abi: abi,
        chainId: 31337,
        functionName: 'publishProperty',
        signerOrProvider: provider,
        args: [updatedId],
        enabled: Boolean(updatedId)
    })

    const {config: mintConfig} = usePrepareContractWrite({
        address: propertiesAddress,
        abi: abi,
        chainId: 31337,
        functionName: 'mintProperty',
        signerOrProvider: provider,
        args: [mintId],
        enabled: Boolean(mintId)
    })

    const {config: transferConfig} = usePrepareContractWrite({
        address: propertiesAddress,
        abi: abi,
        chainId: 31337,
        functionName: 'transferTo',
        overrides: {
            value: ethers.utils.parseEther('0.1'),
        },
        signerOrProvider: provider,
        args: [address,transferTokenId],
        enabled: Boolean(transferTokenId)
    })

    const {write: del} = useContractWrite({
        ...deleteConfig,
        onSuccess: async (data) => {
            const res = await data.wait();
            if (res.status === 1) {
                toast({
                    title: 'Congratulations',
                    description: "Le bien immobilier a été supprimé avec succés ",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'Error',
                    description: "Une erreur est survenue lors de la suppression du bien immobilier",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
        },
        onError: error => {
            toast({
                title: 'Error',
                description: "unknown error was occurred ",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        },
    });

    const {write: publish} = useContractWrite({
        ...publishConfig,
        onSuccess: async (data) => {
            const res = await data.wait();
            if (res.status === 1) {
                toast({
                    title: 'Congratulations',
                    description: "Le bien immobilier a été bien publié",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'Error',
                    description: "Une erreur est survenue lors de la publication du bien immobilier",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
        },
        onError: error => {
            toast({
                title: 'Error',
                description: "unknown error was occurred ",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        },
    });

    const {write: mint} = useContractWrite({
        ...mintConfig,
        onSuccess: async (data) => {
            const res = await data.wait();
            if (res.status === 1) {
                toast({
                    title: 'Congratulations',
                    description: "Le bien immobilier a été bien tokenisé",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'Error',
                    description: "Une erreur est survenue lors de la tokenisation du bien immobilier",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
        },
        onError: error => {
            toast({
                title: 'Error',
                description: "unknown error was occurred ",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        },
    });

    const {write: transfer} = useContractWrite({
        ...transferConfig,
        onSuccess: async (data) => {
            const res = await data.wait();
            if (res.status === 1) {
                toast({
                    title: 'Congratulations',
                    description: "Le token a été transféré avec succés",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'Error',
                    description: "Une erreur est survenue du transfer du token , veuillez vérifier le prix proposé.",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
        },
        onError: error => {
            toast({
                title: 'Error',
                description: "unknown error was occurred ",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        },
    });

    useEffect(() => {
        async function getProperties() {
            if (contract && contractRead) {
                setProperties(contractRead.data);
            }
        }

        async function getTokens() {
            if (contract && contractReadToken) {
                setTokens(contractReadToken.data);
            }
        }
        getProperties();
        getTokens();
    })

    function deleteProperty(id) {
        setDeletedId(id);
        del?.();
    }

    function publishProperty(id) {
        setUpdatedId(id);
        publish?.();
    }

    function mintProperty(id) {
        setMintId(id);
        mint?.();
    }

    function transferToken(address, id) {
        setTransferTokenId(id);
        transfer?.();
    }

    function isOwner() {
        return address === creator1.data;
    }

    return (
        isOwner() ? <SimpleGrid spacing={6}>
            {properties?.length > 0 ? properties.filter(item => item.name !== '').map((item) => {
                return (<Card key={item.id}>
                    <CardHeader>
                        <Heading size='md'>{item.name}</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>{item.description}</Text>
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
                        <Button flex='1' variant='ghost' leftIcon={<ExternalLinkIcon/>}
                                onClick={() => publishProperty(item.id)}
                                hidden={item.isPublished}>
                            Publier
                        </Button>
                        <Button flex='1' variant='ghost' leftIcon={<ExternalLinkIcon/>}
                                onClick={() => publishProperty(item.id)}
                                hidden={!item.isPublished} onClick={() => mintProperty(item.id)}>
                            Mint
                        </Button>
                        <Button flex='1' variant='ghost' leftIcon={<DeleteIcon/>}
                                hidden={item.isPublished} onClick={() => deleteProperty(item.id)}>
                            Supprimer
                        </Button>
                    </CardFooter>
                </Card>)
            }) : <></>}
        </SimpleGrid> : <SimpleGrid spacing={6}>
            {tokens?.length > 0 ? tokens.map((item) => {
                return (<Card key={item.id}>
                    <CardHeader>
                        <Heading size='md'>{item.name}</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>{item.url}</Text>
                        <Text>{properties[item.propertyId].name}</Text>
                        <Text>{properties[item.propertyId].description}</Text>
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
                        <Button flex='1' variant='ghost' leftIcon={<ExternalLinkIcon/>}
                                onClick={() => transferToken(address,item.id)}>
                            Acheter
                        </Button>
                    </CardFooter>
                </Card>)
            }) : <></>}
        </SimpleGrid>
    )
}

export default Table;