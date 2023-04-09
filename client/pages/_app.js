import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css'
import {
    getDefaultWallets,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {configureChains, createClient, WagmiConfig} from 'wagmi';
import {hardhat} from 'wagmi/chains';
import {infuraProvider} from 'wagmi/providers/infura';
import {publicProvider} from 'wagmi/providers/public';
import {ChakraProvider, extendTheme} from '@chakra-ui/react'

const {chains, provider} = configureChains(
    [hardhat],
    [
        publicProvider()
    ]
);

const {connectors} = getDefaultWallets({
    appName: 'Real estate tokenization',
    chains
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})


export default function App({Component, pageProps}) {
    return (
        <ChakraProvider>
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains}>
                    <Component {...pageProps} />
                </RainbowKitProvider>
            </WagmiConfig>
        </ChakraProvider>
    )
}
