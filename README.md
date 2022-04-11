# Idle CDO cards
Idle CDO Cards NFT contract allows to mint Idle CDO cards balancing the risk exposure between the trenches AA and BB.

## Motivation

This product is based on  **Gitcoin Hackathon: Grants Round 11 Hackathon**
**Build On Top Of Idle Perpetual Yield Tranches!** bounty.

https://gitcoin.co/issue/Idle-Labs/idle-contracts/33/100026511


On the other hand, Some improvements were suggested by IdleDAO and the [project](https://github.com/elmol/idle-cdo-cards/projects/1) was created in order to follow up on them.

### Challenge Description
Build products or strategies on top of Idle Perpetual Yield Tranches.

Show your creativity: in this challenge, you should create and develop a product employing Idle Tranches as yield source (e.g., create an effective CDO contract where you bundle different classes of Idle Perpetual Yield Tranches together).

### Scope 

It should be seen it as an initial seed and **proof of concept** to start building on Idle Tranches protocol.

[issue-1](https://github.com/elmol/idle-cdo-cards/issues/3) implementation: Allow Idle Cards combining IdleDAI + IdleFEI CDOs.

### Demo



https://user-images.githubusercontent.com/5402004/162840950-349949a7-2e89-4f93-9393-d758a0f0a6c2.mp4



## What is Idle CDO Cards?

Totally based on **Idle Perpetual Yield Tranches** https://github.com/Idle-Labs/idle-tranches#readme, Idle CDO Cards allows to create different types of investing strategies balancing risk and gain.

This strategies are represented by Idle CDO Cards, which are a NFT token. The cards (as any NFT token) could be traded in a NFT marketplace, used as collateral, or simply burned to get the profits.

## Who does it work?

When you mint a card, you can choose the exposure balancing between the expected profits and risk. The amount is split proportionally based on the exposure and deposited in tranches AA (less risky) or BB (more risky) as appropriate.  

![delivery-issue-3](https://user-images.githubusercontent.com/5402004/162841103-80c9e850-39aa-418e-860f-dff2ada1013d.png)


## Technical Details 

### Idle CDO Cards UI

You can find technical information for the UI client in [README Idle Cards UI](https://github.com/elmol/idle-cdo-cards/tree/main/risk-cards-ui#readme)

The code is located in https://github.com/elmol/idle-cdo-cards/tree/main/risk-cards-ui

### Idle CDO Cards Contract

You can find the Idle CDO Card contract in the idle-tranches fork https://github.com/elmol/idle-tranches

**Contract Files**: 
- Card Manager: https://github.com/elmol/idle-tranches/blob/issue-3-combining-dai-fei/contracts/IdleCDOCardManager.sol
- Card: https://github.com/elmol/idle-tranches/blob/issue-3-combining-dai-fei/contracts/IdleCDOCard.sol
- ERC721 Simple Composite: https://github.com/elmol/idle-tranches/blob/issue-3-combining-dai-fei/contracts/ERC721SimpleComposite.sol

#### Deploy for manual testing
1. Clone idle-tranches fork https://github.com/elmol/idle-tranches and checkout the branch issue-3-combining-dai-fei
2. Be sure that you have configured your alchemy key in .env file
3. Upload local node with hardhat

```
npx hardhat node
```

4. Deploy Contracts 
```
# npx hardhat deploy-cards-test --network localhost

================================================================================
📤 Idle CDO Cards deployed at 0xCace1b78160AE76398F486c8a18044da0d66d86D
📤 Idle CDO DAI deployed at 0xDC11f7E700A4c898AE5CAddB1082cFfa76512aDD by owner 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
💵 DAI Underlying Token address: 0xFD471836031dc5108809D173A067e8486B9047A3
📤 Idle CDO FEI deployed at 0x51A1ceB83B83F1985a81C295d1fF28Afef186E02 by owner 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
💵 FEI Underlying Token address: 0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc
🔎 Buyer address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
================================================================================
```

5. Connect through metamask to localhost:8545 and import the <br>
    _account:_ 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 <br>
    _PK:_ 59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d <br>
    *Caveat:* be sure that the configured chainId in metamask is *31337* <br>


6. Go to  https://elmol.github.io/idle-cdo-cards/



#### Test Coverage

File                               |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-----------------------------------|----------|----------|----------|----------|----------------|
  IdleCDOCard.sol                  |      100 |      100 |      100 |      100 |                |
  IdleCDOCardManager.sol           |      100 |      100 |      100 |      100 |                |

#### Gas Report
In order to generate the gas report the following env variable should be configured in .env files in https://github.com/elmol/idle-tranches project
```
REPORT_GAS=true
```

## Next steps and open discussion

As we mentions in the scope this is a POC in order to start building on  Idle Tranches protocol that server to open discussions and have an early feedback. So, this not should be put into production **for now**.   

### Allow the users to choose different tranches of different IdleCDO in a single Idle CDO NFT Card. (UI included)

https://github.com/elmol/idle-cdo-cards/projects/1

### Investment and reinvestment period. 
~~**Currently** the investment period is not considered for Cards Protocol. Therefore, the profit produced by a card during a period is shared between all. In other words, the time from a card was minted (mint period)_ _is not taken into account. And this is wrong.~~ 

~~There were/are analyzing different strategies like delegate calls to Idle Tranches, external periodical harvest per card, analytic period profit using oracles, and contract pool creation per card like Uniswap v3.~~

It was *FIXED* creating a card contract for each card https://github.com/elmol/idle-tranches/pull/1

### Idle protocol rewards.
Currently idle rewards are not returned to the investor in any way. There is not an strategy defined for stack or reinvest this rewards.

