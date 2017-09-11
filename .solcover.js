module.exports = {
  skipFiles: [
    'interfaces/Ownable.sol',
    'interfaces/Pausable.sol',
    'SafeMath.sol',
    'MultiSigWallet.sol',
    'MiniMeToken.sol',
    'mocks/FailingMockToken.sol',
  ],
  copyNodeModules: true,
};
