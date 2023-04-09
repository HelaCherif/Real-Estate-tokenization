import {Button, Card, CardBody, CardFooter, CardHeader, Heading, SimpleGrid,Text} from "@chakra-ui/react";
import {DeleteIcon, EditIcon, ExternalLinkIcon} from '@chakra-ui/icons'

function CustomCard() {

    return (
        <Card>
            <CardHeader>
                <Heading size='md'> Customer dashboard</Heading>
            </CardHeader>
            <CardBody>
                <Text>View a summary of all your customers over the last month.</Text>
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
                <Button flex='1' variant='ghost' leftIcon={<EditIcon />}>
                    Modifier
                </Button>
                <Button flex='1' variant='ghost' leftIcon={<ExternalLinkIcon />}>
                    Publier
                </Button>
                <Button flex='1' variant='ghost' leftIcon={<DeleteIcon />}>
                    Supprimer
                </Button>
            </CardFooter>
        </Card>
    )
}

export default CustomCard;