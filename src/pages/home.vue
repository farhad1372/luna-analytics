<template>
    <div class="grid">
        <vs-row>
            <vs-col w="12">
                <h1 class="">Terradash Part 2: Staking and Supply</h1>
                <h2 class="mt-14">Question and Demands:</h2>
                <p class="">
                    We’re working with Terra to rebuild the great <a href="https://terradash.vercel.app/"
                        target="_blank">terradash</a>, a dazzling dashboard full of analytic
                    insights providing an overview of the entire Terra ecosystem— and we need your help! We are building
                    out this new and improved Terradash in parts.

                    This week for Part 2: examine token supply and staking activity on Terra, both in terms of
                    transactions, volumes and wallets. Be sure to include the following metrics (and more), noting any
                    trends or outliers you see.
                </p>
                <ul>
                    <li>Total Supply</li>
                    <li>Circulating Supply</li>
                    <li>Vesting Schedule</li>
                    <li>% LUNA IBC-ed out</li>
                    <li>Richlist (Top 100)</li>
                    <li>of LUNA staked</li>
                    <li>% of LUNA staked</li>
                    <li>Staking rewards distributed in USD trend</li>
                </ul>
                <p>
                    We are not looking for data on Terra Classic for this bounty.<br />
                    Please use the terra.core tables hosted on Flipside Crypto.<br />
                    The final product at the end of this series will be a comprehensive dashboard combining together
                    multiple aspects of the Terra blockchain. We want this to be highly shareable with a focus on
                    UI/UX-- so keep this in mind during the early stages!
                </p>

                <h2 class="pr-0 pl-0">Understanding Terra</h2>
                <p>
                    Terra is a payment system that resides and is built upon a blockchain. It was developed by South
                    Korea-based Terraform Labs, which was founded in 2018 by Do Kwon and Daniel Shin. Do Kwon was
                    formerly employed by Microsoft and Apple and founded a startup, Anyfi, which offered decentralized
                    wireless mesh networking solutions. Shin is the founder and CEO of Asian payment technology company
                    Chai—a Terra partner—and was co-founder of Korean e-commerce firm TMON, also known as Ticket
                    Monster.23
                </p>

                <p>
                    The business rationale for developing Terra is outlined in a white paper from April 2019 that lists
                    Do Kwon as one of its four co-authors.<br />
                    4 The paper proposes a cryptocurrency named Terra that is:
                </p>

                <ul>
                    <li>Price-stable and growth-driven</li>
                    <li>Based on the view that a price-stable cryptocurrency combines the best features of fiat
                        currencies and
                        <a target="_blank" href="https://www.investopedia.com/terms/b/bitcoin.asp">Bitcoin (BTC).</a>
                    </li>
                    <li>A successful new digital currency needs to maximize adoption to become useful as a medium of
                        exchange.5</li>
                </ul>

                <p>
                    The paper notes that there is demand for a decentralized, price-stable money protocol in both fiat
                    and blockchain economies, and such a protocol could be the best use case for cryptocurrencies.4

                    In its quest to become a leading e-commerce stablecoin payment and
                    <a href="https://www.investopedia.com/decentralized-finance-defi-5113835"> decentralized finance
                        (DeFi)</a>
                    service provider, Terra has a growing ecosystem in the crypto space with 114 projects across
                    DeFi, <a href="https://www.investopedia.com/web-20-web-30-5208698">Web 3.0</a> , and <a
                        href="https://www.investopedia.com/non-fungible-tokens-nft-5115211">non-fungible tokens
                        (NFTs)</a>. These projects include:
                </p>

                <ul>
                    <li>Anchor Protocol: A fixed yield platform with borrowing yields and frictionless access</li>
                    <li>Chai: A payments app with over 2 million users in South Korea</li>
                    <li>LoTerra: A decentralized lottery platform built on the Terra blockchain</li>
                    <li>Mirror Protocol: Allows for the creation of fungible assets or "synthetics" that track
                        real-world asset prices</li>
                    <li>Talis Protocol: A platform where artists can sell their creations and offer services</li>
                    <li>Vega Protocol: A platform for minting and trading derivatives6</li>
                </ul>

                <h3>Terra and Luna</h3>

                <p>
                    Because the primary value of stablecoins is derived from the stability of the price peg,
                    theoretically bypassing the volatility typical of cryptocurrencies, the Terra protocol attempts to
                    maintain the price of the Terra stablecoin by ensuring that the supply and demand for it are always
                    balanced by employing arbitrage.1 <br />
                    Luna is the variable counterweight to the Terra stablecoin and absorbs its volatility. To understand
                    how Terra works, envision the entire Terra "economy" to consist of a Terra pool and a Luna pool,
                    which are used to adjust the price via incentives for network participants.
                </p>

                <p>
                    Read more: <a
                        href="https://www.investopedia.com/terra-5209502">https://www.investopedia.com/terra-5209502</a>
                </p>


                <!-- <vs-alert>
                    <template #title>
                        Vuesax Framework
                    </template>
                    Vuesax (pronounced / vjusacksː /, as view sacks) is a <b>UI components framework</b>
                    created with <a href="https://vuejs.org/">Vuejs</a> to make projects easily and with a
                    Unique and pleasant style, Vuesax is created from scratch and designed for all types of
                    developed from the frontend lover to the backend that wants to easily create
                    your visual approach to the end user
                </vs-alert> -->
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
import { Flipside } from "../../libs/@flipsidecrypto/sdk";
// const Flipside = require('@flipsidecrypto/sdk');

export default {
    data() {
        return {

        }
    },
    methods: {
        async sendApi() {
            try {
                const flipside = new Flipside("089b070c-2f41-42b9-86f0-2c56a53e0529");
                // const myAddress = "0x....";

                const sql = `
                  SELECT 
                      block_timestamp, 
                    buyer_address,
                      seller_address,
                      tokenid,
                      token_metadata,
                    price_usd
                  FROM ethereum.core.ez_nft_sales
                  WHERE 
                    platform_name = 'opensea' AND
                    event_type = 'sale' AND
                      project_name = 'moonbirds'
                  ORDER BY block_timestamp DESC
                  LIMIT 20
                `
                // const query = {
                //     sql: `select nft_address, mint_price_eth, mint_price_usd from flipside_prod_db.ethereum_core.ez_nft_mints where nft_to_address = LOWER('${myAddress}')`,
                //     ttlMinutes: 10,
                // }
                const result = await flipside.query.run({ sql });
                console.log(result);


                //

            } catch (e) {
                console.log("eee", e.response || e);
            }
        },
    },
    mounted() {
        // this.sendApi();
    }
}
</script>

<style scoped lang="scss">

</style>