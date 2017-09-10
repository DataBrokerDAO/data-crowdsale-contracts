import { assertOpcode } from './helpers/assertOpcode';
import { sharedSetup } from './helpers/setup';

const EarlyTokenSale = artifacts.require('EarlyTokenSale');

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

contract('DataBrokerDaoToken', function(accounts) {
  it('should return a totalSupply of 0 after construction', async function() {
    const { token } = await sharedSetup(accounts);
    const totalSupply = await token.totalSupply();
    assert.equal(totalSupply.toNumber(), 0);
  });

  it('should return correct balances after generation', async function() {
    const { token } = await sharedSetup(accounts);
    await token.generateTokens(accounts[1], 100);
    const totalSupply = await token.totalSupply();
    assert.equal(totalSupply.toNumber(), 100);
  });

  it('should fail when trying to transfer', async function() {
    const { factory, wallet, token } = await sharedSetup(accounts);
    await token.generateTokens(accounts[0], web3.toWei('100'));
    const { timestamp } = web3.eth.getBlock('latest');
    const sale = await EarlyTokenSale.new(
      timestamp - 3600,
      timestamp + 3600,
      wallet.address,
      token.address
    );
    await token.changeController(sale.address);
    try {
      await token.transfer(accounts[2], web3.toWei('10'));
    } catch (error) {
      return assertOpcode(error);
    }
    assert.fail('should have errored');
  });

  it('should return the correct allowance amount after approval', async function() {
    const { token } = await sharedSetup(accounts);
    await token.generateTokens(accounts[0], 100);
    await token.enableTransfers(true);
    const approve = await token.approve(accounts[1], 90);
    const allowance = await token.allowance(accounts[0], accounts[1]);
    assert.equal(allowance.toNumber(), 90);
  });

  it('should not fail when trying to transfer with transfer enabled', async function() {
    const { token } = await sharedSetup(accounts);
    await token.generateTokens(accounts[0], 100);
    await token.enableTransfers(true);
    await token.transfer(accounts[1], 10);
    const balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0.toNumber(), 90);
    const balance1 = await token.balanceOf(accounts[1]);
    assert.equal(balance1.toNumber(), 10);
  });

  it('should do nothing when trying to transfer more than balance', async function() {
    const { token } = await sharedSetup(accounts);
    await token.generateTokens(accounts[0], 100);
    await token.enableTransfers(true);
    await token.transfer(accounts[1], 101);
    const balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0.toNumber(), 100);
    const balance1 = await token.balanceOf(accounts[1]);
    assert.equal(balance1.toNumber(), 0);
  });

  it('should return correct balances after transfering from another account', async function() {
    const { token } = await sharedSetup(accounts);
    await token.generateTokens(accounts[0], 100);
    await token.enableTransfers(true);
    const approve = await token.approve(accounts[1], 90);
    const transferFrom = await token.transferFrom(
      accounts[0],
      accounts[2],
      90,
      { from: accounts[1] }
    );
    const balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0.toNumber(), 10);
    const balance1 = await token.balanceOf(accounts[2]);
    assert.equal(balance1, 90);
    const balance2 = await token.balanceOf(accounts[1]);
    assert.equal(balance2, 0);
  });

  it('should do nothing when trying to transfer more than allowed', async function() {
    const { token } = await sharedSetup(accounts);
    await token.generateTokens(accounts[0], 100);
    await token.enableTransfers(true);
    await token.approve(accounts[1], 99);
    await token.transferFrom(accounts[0], accounts[2], 100, {
      from: accounts[1],
    });
    const balance0 = await token.balanceOf(accounts[0]);
    assert.equal(balance0.toNumber(), 100);
    const balance1 = await token.balanceOf(accounts[1]);
    assert.equal(balance1.toNumber(), 0);
    const balance2 = await token.balanceOf(accounts[2]);
    assert.equal(balance1.toNumber(), 0);
  });
});
