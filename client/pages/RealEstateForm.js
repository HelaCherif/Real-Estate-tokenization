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
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {useAccount, useContractWrite, usePrepareContractWrite, useProvider} from 'wagmi'
import {BigNumber} from "ethers";
import {abi, propertiesAddress} from "../abi/RealEstate";

function RealEstateForm() {


    const [param1, setParam1] = useState('');


    function validateName(value) {
        let error
        if (!value) {
            error = 'Le nom du bien immobilier est obligatoire'
        }
        return error
    }

    const {address} = useAccount();
    const provider = useProvider();
    let parameter = {};
    const toast = useToast();

    const {config} = usePrepareContractWrite({
        address: propertiesAddress,
        abi: abi,
        chainId: 31337,
        functionName: 'addProperty',
        signerOrProvider: provider,
        args: [[0,30,12,4,5000,false,"name","address","city","complement addresse","descrioption"]],
        onError: async (data) => {
            console.log(data)
        },
        onSuccess: async (data) => {
            console.log(data)
        },
        onSettled: async (data) => {
            console.log("here " + data?.request)
            console.log("hererr " + param1.length)
        },
    })

    const {write : mint} = useContractWrite({
        ...config,
        onSuccess: async (data) => {
            console.log("maman")
            const res = await data.wait();
            console.log("waiiiit")
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
                    description: "An error was occurred when adding the property",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
        },
        onSettled: async (data) => {
            console.log("here " + data)
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
                            tokenNumber: ''
                        }}
                        onSubmit={(values, {setSubmitting}) => {
                            parameter = {
                                tokenNumber: values.tokenNumber,
                                postalCode: values.postalCode,
                                annualYield: values.annualYield,
                                price: values.price,
                                name: values.name,
                                address: values.address,
                                city: values.city,
                                complementaryAddress: values.complementaryAddress,
                                description: values.description,

                            }
                            setParam1([0, BigNumber.from(parameter.tokenNumber), BigNumber.from(parameter.postalCode), BigNumber.from(parameter.annualYield),
                                BigNumber.from(parameter.price), false, parameter.name, parameter.address, parameter.city, parameter.complementaryAddress,
                                parameter.description]);
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
                                    <Field name='tokenNumber'>
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
                                        disabled={!mint} onClick={() => mint?.()}
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