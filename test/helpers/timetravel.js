export const timetravel = s => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        jsonrpc: '2.0',
        method: 'evm_increaseTime',
        params: [s],
        id: new Date().getTime(),
      },
      function(err) {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

export const blocktravel = async (s, accounts) => {
  for (let i = 0; i < s; i++) {
    await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[1],
      value: 1,
    });
  }
};
