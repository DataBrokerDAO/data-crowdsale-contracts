const Promise = require('bluebird');

const MiniMeTokenFactory = artifacts.require('MiniMeTokenFactory');
const EarlyTokenSale = artifacts.require('EarlyTokenSale');
const MultiSigWallet = artifacts.require('MultiSigWallet');
const DataBrokerDaoToken = artifacts.require('DataBrokerDaoToken');

async function performMigration(deployer, network) {
  // Deploy the MiniMeTokenFactory, this is the factory contract that can create clones of the token
  await deployer.deploy(MiniMeTokenFactory);

  // Deploy the MultiSigWallet that will collect the ether
  await deployer.deploy(
    MultiSigWallet,
    [
      '0xBa3e7453323e84A352892c7219Fe8C16FceB7Dd1', // Roderik
      '0x16D0af500dbEA4F7c934ee97eD8EBF190d648de1', // Matthew
      '0x8A69583573b4F6a3Fd70b938DaFB0f61F3536692', // Jonathan
    ],
    2
  );

  // Deploy the actual DataBrokerDaoToken, the controller of the token is the one deploying. (Roderik)
  await deployer.deploy(DataBrokerDaoToken, MiniMeTokenFactory.address);

  if (network === 'mainnet') {
    // Deploy the Early Token Sale, again owned by the one deploying (Roderik)
    await deployer.deploy(
      EarlyTokenSale,
      1505746800, // 09/18/2017 @ 5:00pm (CET)
      1507647600, // 10/16/2017 @ 5:00pm (CET)
      MultiSigWallet.address,
      DataBrokerDaoToken.address
    );
  } else {
    const getBlock = Promise.promisify(web3.eth.getBlock);
    const { timestamp } = await getBlock('latest');
    // Deploy the Early Token Sale, again owned by the one deploying (Roderik)
    await deployer.deploy(
      EarlyTokenSale,
      timestamp - 3600,
      timestamp + 2592000,
      MultiSigWallet.address,
      DataBrokerDaoToken.address
    );
  }

  // Set the controller of the token to the early token sale
  const DeployedDataBrokerDaoToken = await DataBrokerDaoToken.deployed();
  DeployedDataBrokerDaoToken.changeController(EarlyTokenSale.address);
}

module.exports = function(deployer, network) {
  deployer
    .then(function() {
      return performMigration(deployer, network);
    })
    .catch(error => {
      console.log(error);
      process.exit(1);
    });
};
