import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Container,
    FormControl,
    FormErrorMessage,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Stack,
    Textarea,
    useToast,
    VStack
} from "@chakra-ui/react";
import {Field, Form, Formik} from 'formik';
import React, {useState} from "react";
import Link from "next/link";
import {useAccount, useContractWrite, usePrepareContractWrite, useProvider} from 'wagmi'
import {abi, propertiesAddress} from "../abi/RealEstate";

function RealEstateForm() {
    const [param, setParam] = useState([]);

    function validateName(value) {
        let error
        if (!value) {
            error = 'Le nom du bien immobilier est obligatoire'
        }
        return error
    }

    const provider = useProvider();
    let parameter = {};
    const toast = useToast();

    const {config} = usePrepareContractWrite({
        address: propertiesAddress,
        abi: abi,
        chainId: 31337,
        functionName: 'addProperty',
        signerOrProvider: provider,
        args: [param],
        enabled: param.length > 0
    })

    const {write} = useContractWrite({
        ...config,
        onSuccess: async (data) => {
            const res = await data.wait();
            if (res.status === 1) {
                toast({
                    title: 'Congratulations',
                    description: "Le bien immobilier a été ajouté avec succés ",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                window.location.href = '/';
            } else {
                toast({
                    title: 'Error',
                    description: "Une erreur est survenue lors de l'ajout du bien immobilier",
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


    return (
        <VStack padding={'20px'}>
            <Container maxW='container.sm' color='black'>
                <Card>
                    <CardHeader>
                        <Heading size='md'>Nouveau bien immobilier</Heading>
                    </CardHeader>

                    <Formik
                        initialValues={{
                            name: '',
                            description: '',
                            address: '',
                            complementaryAddress: '',
                            postalCode: '',
                            city: '',
                            price: '',
                            annualYield: '',
                            tokensNumber: ''
                        }}
                        onSubmit={(values, {setSubmitting}) => {
                            parameter = {
                                name: values.name,
                                description: values.description,
                                propertyAddress: {
                                    postalCode: values.postalCode,
                                    address: values.address,
                                    city: values.city,
                                    complementaryAddress: values.complementaryAddress,
                                },
                                financialInfos: {
                                    tokensNumber: values.tokensNumber,
                                    annualYield: values.annualYield,
                                    propertyPrice: values.price,
                                    tokenPrice: 100
                                }
                            }
                            setParam([0, parameter.name, parameter.description, false,
                                [Number(parameter.propertyAddress.postalCode), parameter.propertyAddress.address, parameter.propertyAddress.city, parameter.propertyAddress.complementaryAddress],
                                [Number(parameter.financialInfos.tokensNumber), Number(parameter.financialInfos.annualYield), Number(parameter.financialInfos.propertyPrice), Number(parameter.financialInfos.tokenPrice)]]);
                            write?.();
                            setSubmitting(false);
                        }}>

                        {(props) => (<Form>
                            <CardBody>

                                <Stack spacing={5}>
                                    <Field name='name' validate={validateName}>
                                        {({field, form}) => (
                                            <FormControl isInvalid={form.errors.name && form.touched.name}>
                                                <Input {...field} placeholder='Nom de la proprieté'/>
                                                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name='description'>
                                        {({field}) => (
                                            <Textarea {...field} placeholder='Description'/>
                                        )}
                                    </Field>
                                    <Field name='address'>
                                        {({field}) => (
                                            <Input {...field} placeholder='Addresse'/>
                                        )}
                                    </Field>
                                    <Field name='complementaryAddress'>
                                        {({field}) => (
                                            <Input {...field} placeholder="Complement d'addresse"/>
                                        )}
                                    </Field>
                                    <Field name='postalCode'>
                                        {({field}) => (
                                            <Input {...field} placeholder="Code postale"/>
                                        )}
                                    </Field>
                                    <Field name='city'>
                                        {({field}) => (
                                            <Input {...field} placeholder="Ville"/>
                                        )}
                                    </Field>
                                    <Field name='price'>
                                        {({field}) => (
                                            <InputGroup>
                                                <InputLeftElement
                                                    pointerEvents='none'
                                                    color='gray.300'
                                                    fontSize='1.2em'
                                                    children='$'
                                                />
                                                <Input {...field} placeholder='Prix'/>
                                                <InputRightElement/>
                                            </InputGroup>
                                        )}
                                    </Field>
                                    <Field name='annualYield'>
                                        {({field}) => (
                                            <Input {...field} placeholder="Rendement annuel(%)"/>
                                        )}
                                    </Field>
                                    <Field name='tokensNumber'>
                                        {({field}) => (
                                            <NumberInput min={1} clampValueOnBlur={false}>
                                                <NumberInputField {...field} placeholder='Nombre de tokens'/>
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper/>
                                                    <NumberDecrementStepper/>
                                                </NumberInputStepper>
                                            </NumberInput>
                                        )}
                                    </Field>
                                </Stack>
                            </CardBody>
                            <CardFooter justifyContent='right'>
                                <ButtonGroup spacing='2'>
                                    <Button mt={4} colorScheme='teal'>
                                        <Link href="/">Annuler</Link>
                                    </Button>
                                    <Button
                                        mt={4}
                                        colorScheme='teal'
                                        isLoading={props.isSubmitting}
                                        type='submit'
                                    >
                                        Sauvegarder
                                    </Button>
                                </ButtonGroup>
                            </CardFooter>
                        </Form>)}
                    </Formik>
                </Card>
            </Container>
        </VStack>
    )

}

export default RealEstateForm;