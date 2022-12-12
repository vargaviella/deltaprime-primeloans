import addresses from '../common/addresses/avax/token_addresses.json';
import {vectorFinanceApy, vectorFinanceBalance, yieldYakApy, yieldYakBalance} from "./utils/calculate";
import WAVAX_POOL_TUP from '@contracts/WavaxPoolTUP.json';
import USDC_POOL_TUP from '@contracts/UsdcPoolTUP.json';
import PANGOLIN_INTERMEDIARY_TUP from '@contracts/PangolinIntermediaryTUP.json';
import TRADERJOE_INTERMEDIARY_TUP from '@contracts/TraderJoeIntermediaryTUP.json';

export default {
    MAX_COLLATERAL: 500,
    MIN_ALLOWED_HEALTH: 0.0182,
    COMPETITION_START_BLOCK: 14858534,
    DECIMALS_PRECISION: 8,
    chainId: 43114,
    //update leverage after every change in contracts
    ASSETS_CONFIG: {
      "AVAX": {name: "AVAX", symbol: "AVAX", decimals: 18, address: addresses.AVAX, debtCoverage: 0.83333333333},
      "USDC": {name: "USDC", symbol: "USDC", decimals: 6, address: addresses.USDC, isStableCoin: true, debtCoverage: 0.83333333333},
      "BTC": {name: "BTC", symbol: "BTC", decimals: 8, address: addresses.BTC, debtCoverage: 0.83333333333},
      "ETH": {name: "ETH", symbol: "ETH", decimals: 18, address: addresses.ETH, debtCoverage: 0.83333333333},
      "USDT": {name: "USDT", symbol: "USDT", decimals: 6, address: addresses.USDT, isStableCoin: true, debtCoverage: 0.83333333333},
      "LINK": {name: "LINK", symbol: "LINK", decimals: 18, address: addresses.LINK, debtCoverage: 0.83333333333},
      "sAVAX": {name: "sAVAX", symbol: "sAVAX", decimals: 18, address: addresses.sAVAX, debtCoverage: 0.83333333333},
      "QI": {name: "QI", symbol: "QI", decimals: 18, address: addresses.QI, debtCoverage: 0},
      "PNG": {name: "PNG", symbol: "PNG", logoExt: "png", decimals: 18, address: addresses.PNG, debtCoverage: 0},
      "PTP": {name: "PTP", symbol: "PTP", logoExt: "png", decimals: 18, address: addresses.PTP, debtCoverage: 0},
    },
    POOLS_CONFIG: {
        AVAX: {
            address: WAVAX_POOL_TUP.address,
            tokenAddress: addresses.AVAX
        },
        USDC: {
            address: USDC_POOL_TUP.address,
            tokenAddress: addresses.USDC
        }
    },
    LP_ASSETS_CONFIG: {
        "PNG_AVAX_USDC_LP": { primary: 'USDC', secondary: 'AVAX', name: "AVAX-USDC", dex: 'Pangolin',  symbol: 'PNG_AVAX_USDC_LP', decimals: 18, address: addresses.PNG_AVAX_USDC_LP, debtCoverage: 0.83333333333},
        "PNG_AVAX_USDT_LP": { primary: 'USDT', secondary: 'AVAX', name: "AVAX-USDT", dex: 'Pangolin',  symbol: 'PNG_AVAX_USDT_LP', decimals: 18, address: addresses.PNG_AVAX_USDT_LP, debtCoverage: 0.83333333333},
        "PNG_AVAX_ETH_LP": { primary: 'ETH', secondary: 'AVAX', name: "AVAX-ETH", dex: 'Pangolin',  symbol: 'PNG_AVAX_ETH_LP', decimals: 18, address: addresses.PNG_AVAX_ETH_LP, debtCoverage: 0.83333333333},
        "TJ_AVAX_USDC_LP": { primary: 'USDC', secondary: 'AVAX', name: "AVAX-USDC", dex: 'TraderJoe', addMethod: 'addLiquidityTraderJoe', removeMethod: 'removeLiquidityTraderJoe',symbol: 'TJ_AVAX_USDC_LP', decimals: 18, address: addresses.TJ_AVAX_USDC_LP, debtCoverage: 0.83333333333},
        "TJ_AVAX_USDT_LP": { primary: 'USDT', secondary: 'AVAX', name: "AVAX-USDT", dex: 'TraderJoe', addMethod: 'addLiquidityTraderJoe', removeMethod: 'removeLiquidityTraderJoe',symbol: 'TJ_AVAX_USDT_LP', decimals: 18, address: addresses.TJ_AVAX_USDT_LP, debtCoverage: 0.83333333333},
        "TJ_AVAX_ETH_LP": { primary: 'ETH', secondary: 'AVAX', name: "AVAX-ETH", dex: 'TraderJoe', addMethod: 'addLiquidityTraderJoe', removeMethod: 'removeLiquidityTraderJoe',symbol: 'TJ_AVAX_ETH_LP', decimals: 18, address: addresses.TJ_AVAX_ETH_LP, debtCoverage: 0.83333333333},
        "TJ_AVAX_BTC_LP": { primary: 'BTC', secondary: 'AVAX', name: "AVAX-BTC", dex: 'TraderJoe', addMethod: 'addLiquidityTraderJoe', removeMethod: 'removeLiquidityTraderJoe',symbol: 'TJ_AVAX_BTC_LP', decimals: 18, address: addresses.TJ_AVAX_BTC_LP, debtCoverage: 0.83333333333},
        "TJ_AVAX_sAVAX_LP": { primary: 'sAVAX', secondary: 'AVAX', name: "AVAX-sAVAX", dex: 'TraderJoe', addMethod: 'addLiquidityTraderJoe', removeMethod: 'removeLiquidityTraderJoe',symbol: 'TJ_AVAX_sAVAX_LP', decimals: 18, address: addresses.TJ_AVAX_sAVAX_LP, debtCoverage: 0.83333333333},
    },
    DEX_CONFIG: {
        'Pangolin': {
            intermediaryAddress: PANGOLIN_INTERMEDIARY_TUP.address,
            swapMethod: 'swapPangolin',
            addLiquidityMethod: 'addLiquidityPangolin',
            removeLiquidityMethod: 'removeLiquidityPangolin',
            logo: 'png.png'
        },
        'TraderJoe': {
            intermediaryAddress: TRADERJOE_INTERMEDIARY_TUP.address,
            swapMethod: 'swapTraderJoe',
            addLiquidityMethod: 'addLiquidityTraderJoe',
            removeLiquidityMethod: 'removeLiquidityTraderJoe',
            logo: 'joe.png'
        }
    },
    PROTOCOLS_CONFIG: {
        YIELD_YAK: {
            logo: 'yak.svg',
            name: 'Yield Yak'
        },
        VECTOR_FINANCE: {
            logo: 'vector.png',
            name: 'Vector Finance'
        },
    },
    FARMED_TOKENS_CONFIG: {
        AVAX: [
            {
                protocol: 'YIELD_YAK',
                apy: async () => yieldYakApy('0xaAc0F2d0630d1D09ab2B5A400412a4840B866d95'),
                staked: async (address) => yieldYakBalance('0xaAc0F2d0630d1D09ab2B5A400412a4840B866d95', address),
                stakeMethod: 'stakeAVAXYak',
                unstakeMethod: 'unstakeAVAXYak',
                feedSymbol: 'YY_AAVE_AVAX',
                token: 'AVAX',
                info: 'This strategy compounds AVAX in AAVE',
                debtCoverage: 0.83333333333
            },
            {
                protocol: 'VECTOR_FINANCE',
                apy: async () => vectorFinanceApy('AVAX'),
                staked: async (address) => vectorFinanceBalance('0xab42ed09F43DDa849aa7F62500885A973A38a8Bc', address),
                stakeMethod: 'vectorStakeWAVAX1',
                unstakeMethod: 'vectorUnstakeWAVAX1',
                minAmount: 0.8,
                token: 'AVAX',
                info: 'Uses Vector Finance strategy on Platypus. Withdrawal fees may apply',
                debtCoverage: 0.83333333333
            }
        ],
        sAVAX: [
            {
                protocol: 'YIELD_YAK',
                apy: async () => yieldYakApy('0xd0F41b1C9338eB9d374c83cC76b684ba3BB71557'),
                staked: async (address) => yieldYakBalance('0xb8f531c0d3c53B1760bcb7F57d87762Fd25c4977', address),
                stakeMethod: 'stakeSAVAXYak',
                unstakeMethod: 'unstakeSAVAXYak',
                token: 'SAVAX',
                debtCoverage: 0.83333333333
            },
            {
                protocol: 'VECTOR_FINANCE',
                apy: () => vectorFinanceApy('SAVAX'),
                staked: (address) => vectorFinanceBalance('0x91F78865b239432A1F1Cc1fFeC0Ac6203079E6D7', address),
                stakeMethod: 'vectorStakeSAVAX1',
                unstakeMethod: 'vectorUnstakeSAVAX1',
                minAmount: 0.8,
                token: 'SAVAX',
                info: 'Uses Vector Finance strategy on Platypus. Withdrawal fees may apply',
                debtCoverage: 0.83333333333
            }
        ],
        USDC: [
            {
                protocol: 'VECTOR_FINANCE',
                //TODO: check if it's a right APY
                apy: () => vectorFinanceApy('USDC'),
                staked: (address) => vectorFinanceBalance('0xE5011Ab29612531727406d35cd9BcCE34fAEdC30', address, 6),
                stakeMethod: 'vectorStakeUSDC1',
                unstakeMethod: 'vectorUnstakeUSDC1',
                minAmount: 0.8,
                token: 'USDC',
                debtCoverage: 0.83333333333
            }
        ],
        PNG_AVAX_USDC_LP: [
            {
                protocol: 'YIELD_YAK',
                apy: () => yieldYakApy('0xC0cd58661b68e10b49D3Bec4bC5E44e7A7c20656'),
                staked: (address) => yieldYakBalance('0xC0cd58661b68e10b49D3Bec4bC5E44e7A7c20656', address),
                stakeMethod: 'stakePNGAVAXUSDCYak',
                unstakeMethod: 'unstakePNGAVAXUSDCYak',
                feedSymbol: 'YY_PNG_AVAX_USDC_LP',
                token: 'PNG_AVAX_USDC_LP',
                debtCoverage: 0.83333333333
            }
        ],
        PNG_AVAX_ETH_LP: [
            {
                protocol: 'YIELD_YAK',
                apy: () => yieldYakApy('0xFCD2050E213cC54db2c9c99632AC870574FbC261'),
                staked: (address) => yieldYakBalance('0xFCD2050E213cC54db2c9c99632AC870574FbC261', address),
                stakeMethod: 'stakePNGAVAXETHYak',
                unstakeMethod: 'unstakePNGAVAXETHYak',
                feedSymbol: 'YY_PNG_AVAX_ETH_LP',
                token: 'PNG_AVAX_ETH_LP',
                debtCoverage: 0.83333333333
            }
        ],
        TJ_AVAX_USDC_LP: [
            {
                protocol: 'YIELD_YAK',
                apy: () => yieldYakApy('0xDEf94a13fF31FB6363f1e03bF18fe0F59Db83BBC'),
                staked: (address) => yieldYakBalance('0xDEf94a13fF31FB6363f1e03bF18fe0F59Db83BBC', address),
                stakeMethod: 'stakeTJAVAXUSDCYak',
                unstakeMethod: 'unstakeTJAVAXUSDCYak',
                feedSymbol: 'YY_TJ_AVAX_USDC_LP',
                token: 'TJ_AVAX_USDC_LP',
                debtCoverage: 0.83333333333

            }
        ],
        TJ_AVAX_ETH_LP: [
            {
                protocol: 'YIELD_YAK',
                apy: () => yieldYakApy('0x5219558ee591b030E075892acc41334A1694fd8A'),
                staked: (address) => yieldYakBalance('0x5219558ee591b030E075892acc41334A1694fd8A', address),
                stakeMethod: 'stakeTJAVAXETHYak',
                unstakeMethod: 'unstakeTJAVAXETHYak',
                feedSymbol: 'YY_TJ_AVAX_ETH_LP',
                token: 'TJ_AVAX_ETH_LP',
                debtCoverage: 0.83333333333
            }
        ],
        TJ_AVAX_sAVAX_LP: [
            {
                protocol: 'YIELD_YAK',
                apy: () => yieldYakApy('0x22EDe03f1115666CF05a4bAfafaEe8F43D42cD56'),
                staked: (address) => yieldYakBalance('0x22EDe03f1115666CF05a4bAfafaEe8F43D42cD56', address),
                stakeMethod: 'stakeTJAVAXSAVAXYak',
                unstakeMethod: 'unstakeTJAVAXSAVAXYak',
                feedSymbol: 'YY_TJ_AVAX_sAVAX_LP',
                token: 'TJ_AVAX_sAVAX_LP',
                debtCoverage: 0.83333333333
            }
        ],
    },
    nativeToken: "AVAX",
    SLIPPAGE_TOLERANCE: 0.03,
    MAX_POOL_UTILISATION: 0.95,
    dataProviderId: "redstone-avalanche-prod",
    subgraph: "https://api.thegraph.com/subgraphs/name/mbare0/delta-prime"
}
