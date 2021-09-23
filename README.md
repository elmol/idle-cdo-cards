# Idle CDO cards
Idle CDO Cards NFT contract allows to mint Idle CDO cards balancing the risk exposure between the trenches AA and BB.

## Motivation

This product is based on  **Gitcoin Hackathon: Grants Round 11 Hackathon**
**Build On Top Of Idle Perpetual Yield Tranches!** bounty.

https://gitcoin.co/issue/Idle-Labs/idle-contracts/33/100026511


### Challenge Description
Build products or strategies on top of Idle Perpetual Yield Tranches.

Show your creativity: in this challenge, you should create and develop a product employing Idle Tranches as yield source (e.g., create an effective CDO contract where you bundle different classes of Idle Perpetual Yield Tranches together).

### Scope 

It should be seen it as an initial seed and **proof of concept** to start building on Idle Tranches protocol.

### Demo


https://user-images.githubusercontent.com/5402004/134591446-2d956161-0f52-4b09-a11a-858b48b18965.mp4


## What is Idle CDO Cards?

Totally based on **Idle Perpetual Yield Tranches** https://github.com/Idle-Labs/idle-tranches#readme, Idle CDO Cards allows to create different types of investing strategies balancing risk and gain.

This strategies are represented by Idle CDO Cards, which are a NFT token. The cards (as any NFT token) could be traded in a NFT marketplace, used as collateral, or simply burned to get the profits.

## Who does it work?

When you mint a card, you can choose the exposure balancing between the expected profits and risk. The amount is split proportionally based on the exposure and deposited in tranches AA (less risky) or BB (more risky) as appropriate.  


![Screenshot from 2021-09-21 00-01-09](https://user-images.githubusercontent.com/5402004/134105378-45761ae3-13d2-41a4-86df-20884d6d6f85.png)

## Technical Details 

### Idle CDO Cards UI

You can find technical information for the UI client in [README Idle Cards UI](https://github.com/elmol/idle-cdo-cards/tree/main/risk-cards-ui#readme)

The code is located in https://github.com/elmol/idle-cdo-cards/tree/main/risk-cards-ui

### Idle CDO Cards Contract

You can find the Idle CDO Card contract in the idle-tranches fork https://github.com/elmol/idle-tranches

**Contract File**: https://github.com/elmol/idle-tranches/blob/master/contracts/IdleCDOCards.sol

#### Deploy for manual testing
```
# npx hardhat deploy-cards-test --network localhost

==========================================================================
📤 Idle CDO deployed at 0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e by owner 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
📤 Idle CDO Cards deployed at 0x09635F643e140090A9A8Dcd712eD6285858ceBef
🔎 Buyer address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
💵 Token address: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
==========================================================================
```

#### Test Coverage

File                               |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-----------------------------------|----------|----------|----------|----------|----------------|
contracts/IdleCDOCards.sol         |      100 |      100 |      100 |      100 |                |

## Next steps and open discussion

As we mentions in the scope this is a POC in order to start building on  Idle Tranches protocol that server to open discussions and have an early feedback. So, this not should be put into production **for now**.   

### Investment and reinvestment period. 
**Currently** the investment period is not considered for Cards Protocol. Therefore, the profit produced by a card during a period is shared between all. In other words, the time from a card was minted (mint period) is not taken into account. And this is wrong.  

There were/are analyzing different strategies like delegate calls to Idle Tranches, external periodical harvest per card, analytic period profit using oracles, and contract pool creation per card like Uniswap v3.


### Idle protocol rewards.
Currently idle rewards are not returned to the investor in any way. There is not an strategy defined for stack or reinvest this rewards.

