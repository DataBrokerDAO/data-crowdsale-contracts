# DataBrokerDAO crowdsale contracts [![Build Status](https://travis-ci.org/DataBrokerDAO/crowdsale-contracts.svg?branch=master)](https://travis-ci.org/DataBrokerDAO/crowdsale-contracts)

## 1. The DATA token is a MiniMe token
The MiniMe Token is an ERC20 token created by the Giveth team. This token is ERC20 compliant and adds two useful features to it. It allows for the creation of spin off tokens that can have custom logic. Which means it brings the opportunity to upgrade the token itself or to create for example reputation tokens to be awarded based on DATA token holdings. The second feature is that it keeps a full record of balances at each block. The MiniMe token is not new, and it has proven its value in projects like Aragon, Giveth, Swarm City, Status IM and Mothership. Using a token that has been audited and tested in all these projects makes for a very secure and proven base for the DATA token.

## 2. The DATA token is controlled by the Early Token Sale contract
The controller of the token is the party that can create new tokens. The DATA token supply is not pre-mined. The contract only generates the tokens that are sold during the sale. During this initial phase, the EarlyTokenSale contract is the controller of the token. The sale will start from the 18th of September at 5 PM CET and will run for four weeks.

Coded into the sale contract are the limits of a maximum of 28125 ETH collected at a fixed rate of 1200 DATA tokens per ETH. Again using tested techniques, the contract tries to prevent an uneven distribution by limiting the gas price to 50.000.000.000 and allow an address to contribute only once per 100 blocks. The gas amount needed to contribute is 300.000, the amount not used is sent back automatically by the Ethereal blockchain.

## 3. Security and compliance
We have focussed a lot on the safety of the token and the sale. By building on the shoulders of giants, each with their contract audits, we have eliminated a lot of potential issues. Combined with an independent contract review for our code by Matthew Di Ferrante which is currently under way, we are as sure as we can be for the security of the sale and token. Additionally, we have ensured that the sale can be halted and restarted at any time in case of an emergency.

On the regulatory front, especially with the shifting tides globally, we are striving to become the first fully compliant sale in the world. To do this, we are partnering with IdentityMind and their new token sale KYC/AML product. All token sale contributors are reviewed by a state of the art risk-based KYC (Know Your Customer) product to make certain they are coming from an acceptable country, they are not obfuscating their IP address, they aren’t a known bad actors, and that they are not on any government’s list of sanctioned individuals. Also they prevent contributors from creating more than one account, ensuring they undergo the proper KYC requirements and cannot use the token sale as a way to launder money. The regulation around token sales is still being formed in most countries. However, individual countries have already specified what’s required. When this occurs, IdentityMind ensures that all contributors are screened per the requirements of that country.

## 4. Concluding the early token sale

After the early token sale ends, either by selling the maximum amount of tokens assigned (15%) or if the four week period has passed a finalisation function will be called. This will mint the platform and team allocations as described in the white paper. In the period immediately after the sale concludes, the final referrals will be calculated and paid out from the platforms wallet.

## 5. Testing

The code is thoroughly tested and can be reviewed at https://travis-ci.org/DataBrokerDAO/crowdsale-contracts

## 6. Join the conversation

* Learn more about DataBroker DAO at  —  https://databrokerdao.com 
* Join Slack channel at  —  https://slack.databrokerdao.com/ 
* Join DataBroker DAO Telegram channel at  —  https://t.me/databrokerdao 
* Find DataBroker DAO on Facebook at  —  https://www.facebook.com/DataBrokerDAO/ 
* Follow DataBroker DAO on Twitter at  —  https://twitter.com/DataBrokerDAO
