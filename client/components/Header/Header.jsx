import {
    Button,
    Flex,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Text
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import {HamburgerIcon} from '@chakra-ui/icons'
const Header = () => {
    return (
        <Flex justifyContent="space-between" alignItems="center" height="10vh" width="100%" p="2rem">
            <Text fontWeight="bold">Logo</Text>
            <Flex justifyContent="space-between" alignItems="right">
                <ConnectButton label="Wallet connexion" chainStatus={"full"}/>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<HamburgerIcon />}
                        variant='outline'
                    />
                    <MenuList>
                        <MenuGroup>
                            <MenuItem><Link href="/FAQ">FAQ</Link></MenuItem>
                            <MenuItem><Link href="/about">A propos</Link></MenuItem>
                        </MenuGroup>
                    </MenuList>
                </Menu>

            </Flex>
        </Flex>
    )
}

export default Header;