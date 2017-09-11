import {
  getSaleBeforeSale,
  getSaleAfterSale,
  getSaleDuringSale,
} from './helpers/setup';
import { assertOpcode } from './helpers/assertOpcode';
import { blocktravel } from './helpers/timetravel';

const MiniMeTokenFactory = artifacts.require('MiniMeTokenFactory');
const MiniMeToken = artifacts.require('MiniMeToken');
const EarlyTokenSale = artifacts.require('EarlyTokenSale');
const MultiSigWallet = artifacts.require('MultiSigWallet');
const DataBrokerDaoToken = artifacts.require('DataBrokerDaoToken');
const FailingMockToken = artifacts.require('FailingMockToken');

// testrpc -m "melt object asset crash now another usual cup pool during mad powder"\
//
//
// Available Accounts
// ==================
// (0) 0x9957e37bcdb97c7e7803e9b95f59997b31497e34 <-- deployer
// (1) 0x51623e40a587b8b5d1df053cde68d0439e62c39f
// (2) 0xabb2c59607787a047a64c00f02bb808fac516ecb
// (3) 0xb2f780e60887bf2f1c351387d837aa0c81d52612
// (4) 0x77c41d1b2cf184c4b2842008fa881d1c2a204ddc
// (5) 0x93ad44b5369e04f69299ca17e1da48d3c5891a0f
// (6) 0x4dd53b45fcdc9a8892f7c926cb01032e727fed65
// (7) 0x00a63dd72e4ecf4db8395ac5404d6b7df94e6bf2 <-- multisig owner 1
// (8) 0xf598802b54da5e7f1e18a0f3d801081d1190bad9 <-- multisig owner 2
// (9) 0x9f0d9c5339f92f6e592bdc0c991c4bfd0bb39882 <-- multisig owner 3

// Private Keys
// ==================
// (0) c122f263b2e611d414a95ec041c99b585acc22a865b001652602895687afb7b4
// (1) 654f9a64d24c734ad43ceda2e1f66e52662074bd84e07ab892f032e09d39ce6e
// (2) bffa85fdac3e2a4789ab84828849860c798bd88eff48058a962e1c2791a1e954
// (3) 48dcf7598ce54d4121d23dfdb80c66f0911675b6981290dc1d29082daa883995
// (4) 8ed40615c224b3810d58d2106b14793b731422893e4a809288e0df587eaa0966
// (5) 8d77b51f1472c64bb0eac9dc2b15f10122583f64a8ac1c1328affc95d60fbefc
// (6) 574eeb2d1c75eb3305730f6840011feeb8b439a5e387d26a9eec9509f5569b97
// (7) 90e4ad807017d22558739404cba442b1a8f6a5cf239eb44610a264394aaefc70
// (8) b1d3ac849c1f453e4b1247fd920815c9ef5ed57a540be92017e3a2f6160e3766
// (9) 8dc459c925553f943c4907766e740dbed7d8546e7d491d58299238d7b9641d49

// HD Wallet
// ==================
// Mnemonic:      melt object asset crash now another usual cup pool during mad powder
// Base HD Path:  m/44'/60'/0'/0/{account_index}

contract('EarlyTokenSale', function(accounts) {
  blocktravel(100, accounts);

  it('should fail when trying to send ether before the sale', async function() {
    const { sale, token, wallet } = await getSaleBeforeSale(accounts);
    try {
      web3.eth.sendTransaction({
        from: accounts[0],
        to: sale.address,
        value: web3.toWei(1, 'ether'),
        gas: 200000,
      });
    } catch (error) {
      assertOpcode(error);
    }
    const totalSupply = await token.totalSupply();
    assert.equal(totalSupply.toNumber(), 0);
    const totalCollected = await sale.totalCollected();
    assert.equal(totalCollected.toNumber(), 0);
    const balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0.toNumber(), 0);
    const walletBalance = web3.eth.getBalance(wallet.address);
    assert.equal(walletBalance.toNumber(), 0);
  });

  it('should work when trying to send ether during the sale', async function() {
    const { sale, token, wallet } = await getSaleDuringSale(accounts);
    web3.eth.sendTransaction({
      from: accounts[0],
      to: sale.address,
      value: web3.toWei(1, 'ether'),
      gas: 300000,
    });
    const totalSupply = await token.totalSupply();
    assert.equal(totalSupply.toNumber(), web3.toWei(1200, 'ether'));
    const totalCollected = await sale.totalCollected();
    assert.equal(totalCollected.toNumber(), web3.toWei(1, 'ether'));
    const balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0.toNumber(), web3.toWei(1200, 'ether'));
    const walletBalance = web3.eth.getBalance(wallet.address);
    assert.equal(walletBalance.toNumber(), web3.toWei(1, 'ether'));
  });

  it('should fail when trying to send ether after the sale', async function() {
    const { sale, token, wallet } = await getSaleAfterSale(accounts);
    try {
      web3.eth.sendTransaction({
        from: accounts[0],
        to: sale.address,
        value: web3.toWei(1, 'ether'),
        gas: 200000,
      });
    } catch (error) {
      assertOpcode(error);
    }
    const totalSupply = await token.totalSupply();
    assert.equal(totalSupply.toNumber(), 0);
    const totalCollected = await sale.totalCollected();
    assert.equal(totalCollected.toNumber(), 0);
    const balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0.toNumber(), 0);
    const walletBalance = web3.eth.getBalance(wallet.address);
    assert.equal(walletBalance.toNumber(), 0);
  });

  it('should be able to finalise after the sale', async function() {
    const { sale, token, wallet } = await getSaleAfterSale(accounts);
    await sale.finalizeSale();
    const totalSupply = await token.totalSupply();
    assert.equal(
      totalSupply.toNumber(),
      56250000000000000000000000 + 22500000000000000000000000
    );
    const balance0 = await token.balanceOf(wallet.address);
    assert.equal(
      balance0.toNumber(),
      56250000000000000000000000 + 22500000000000000000000000
    );
  });

  it('should fail when trying to send ether when the sale is pauzed', async function() {
    const { sale, token, wallet } = await getSaleDuringSale(accounts);
    await sale.pauseContribution();
    try {
      web3.eth.sendTransaction({
        from: accounts[0],
        to: sale.address,
        value: web3.toWei(1, 'ether'),
        gas: 200000,
      });
    } catch (error) {
      assertOpcode(error);
    }
    const totalSupply = await token.totalSupply();
    assert.equal(totalSupply.toNumber(), 0);
    const totalCollected = await sale.totalCollected();
    assert.equal(totalCollected.toNumber(), 0);
    const balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0.toNumber(), 0);
    const walletBalance = web3.eth.getBalance(wallet.address);
    assert.equal(walletBalance.toNumber(), 0);
  });

  it('should work when trying to send ether when the sale is unpauzed', async function() {
    const { sale, token, wallet } = await getSaleDuringSale(accounts);
    await sale.pauseContribution();
    await sale.resumeContribution();
    web3.eth.sendTransaction({
      from: accounts[0],
      to: sale.address,
      value: web3.toWei(1, 'ether'),
      gas: 300000,
    });
    const totalSupply = await token.totalSupply();
    assert.equal(totalSupply.toNumber(), web3.toWei(1200, 'ether'));
    const totalCollected = await sale.totalCollected();
    assert.equal(totalCollected.toNumber(), web3.toWei(1, 'ether'));
    const balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0.toNumber(), web3.toWei(1200, 'ether'));
    const walletBalance = web3.eth.getBalance(wallet.address);
    assert.equal(walletBalance.toNumber(), web3.toWei(1, 'ether'));
  });

  it('should be able to get mistakenly sent ether', async function() {
    const { sale, token, wallet } = await getSaleDuringSale(accounts);
    await sale.claimTokens(0);
  });

  it('should be able to get mistakenly sent tokens', async function() {
    const { sale, token, wallet } = await getSaleDuringSale(accounts);
    const newFactory = await MiniMeTokenFactory.new();
    const newToken = await MiniMeToken.new(
      newFactory.address,
      0x0,
      0,
      'Some Token',
      18,
      'SOME',
      true
    );

    await sale.claimTokens(newToken.address);
  });

  it('should fail when the token generation fails', async function() {
    const factory = await MiniMeTokenFactory.new();
    const wallet = await MultiSigWallet.new(
      [
        accounts[7], // account_index: 7
        accounts[8], // account_index: 8
        accounts[9], // account_index: 9
      ],
      2
    );
    const token = await FailingMockToken.new(factory.address);
    const { timestamp } = web3.eth.getBlock('latest');
    const sale = await EarlyTokenSale.new(
      timestamp - 3600,
      timestamp + 3600,
      wallet.address,
      token.address
    );
    await token.changeController(sale.address);
    try {
      web3.eth.sendTransaction({
        from: accounts[0],
        to: sale.address,
        value: web3.toWei(1, 'ether'),
        gas: 300000,
      });
    } catch (error) {
      assertOpcode(error);
    }
    const totalSupply = await token.totalSupply();
    assert.equal(totalSupply.toNumber(), 0);
    const totalCollected = await sale.totalCollected();
    assert.equal(totalCollected.toNumber(), 0);
    const balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0.toNumber(), 0);
    const walletBalance = web3.eth.getBalance(wallet.address);
    assert.equal(walletBalance.toNumber(), 0);
  });
});
