import React from "react";

import {Container, Heading,} from "@chakra-ui/react";

function FAQ() {
    return (
        <div>
            <Container>
                <Heading>FAQ</Heading>
                <p>
                    Bienvenue sur notre site web de tokenisation immobiliere ! Ici, vous pouvez
                    acheter vos tokens immobiliers et avoir une simulation de votre rendement annuel.
                </p>

                <Heading as={"h2"}> Qu'est-ce que la tokenisation immobilière ?</Heading>
                <p>
                    La tokenisation immobilière est un processus consistant à convertir les actifs immobiliers en
                    actifs numériques (tokens) qui peuvent être achetés, vendus et échangés sur une blockchain.
                    Cela permet une plus grande liquidité et accessibilité pour les investisseurs.
                </p>

                <Heading as={"h2"}>Comment fonctionne la tokenisation immobilière</Heading>
                <p>
                    La tokenisation immobilière implique la création de tokens qui représentent des fractions de
                    propriété d'un bien immobilier.
                    Ces tokens peuvent être achetés et vendus sur une plateforme de blockchain,
                    permettant aux investisseurs d'acquérir une partie de la propriété immobilière.
                    Les transactions sont enregistrées de manière immuable sur la blockchain.
                </p>

                <Heading as={"h2"}>Quels sont les avantages de la tokenisation immobilière ?</Heading>
                <p>
                    Les avantages de la tokenisation immobilière sont la liquidité accrue, la facilité d'achat et de
                    vente,
                    la réduction des coûts et des barrières à l'entrée pour les investisseurs,
                    et la possibilité de diviser la propriété en fractions plus petites,
                    ce qui rend l'investissement dans l'immobilier plus accessible pour les personnes avec un budget
                    plus petit.
                </p>

                <Heading as={"h2"}> Quels sont les risques associés à la tokenisation immobilière ?</Heading>
                <p>
                    Les risques associés à la tokenisation immobilière comprennent la volatilité des marchés de
                    crypto-monnaies,
                    la sécurité et la protection des données, la réglementation, la liquidité, la gestion des tokens et
                    la possibilité de fraude.
                </p>

                <Heading as={"h2"}>Qui peut investir dans des actifs immobiliers tokenisés ?</Heading>
                <p>
                    Les investisseurs intéressés par la tokenisation immobilière doivent se conformer aux
                    réglementations locales et aux exigences de connaissances et
                    de ressources financières avant de pouvoir investir dans des actifs immobiliers tokenisés.
                    Les investisseurs doivent également comprendre les risques associés à ces investissements.
                </p>

                <Heading as={"h2"}>Comment les investisseurs peuvent-ils acheter des tokens immobiliers ?</Heading>
                <p>
                    Les investisseurs peuvent acheter des tokens immobiliers sur des plateformes de blockchain qui
                    proposent des actifs immobiliers tokenisés.
                    Ils doivent d'abord se conformer aux exigences de connaissance et de ressources financières,
                    puis peuvent acheter des tokens à partir de leur portefeuille numérique.
                </p>

                <Heading as={"h2"}>Quels types de biens immobiliers peuvent être tokenisés ?</Heading>
                <p>
                    Tout type de bien immobilier peut être tokenisé, y compris les immeubles de bureaux,
                    les centres commerciaux, les hôtels, les appartements et les maisons unifamiliales.
                </p>
            </Container>
        </div>
    );
};

export default FAQ;