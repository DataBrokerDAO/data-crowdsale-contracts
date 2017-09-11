
pragma solidity ^0.4.15;

import "../MiniMeToken.sol";


contract FailingMockToken is MiniMeToken {  

    bool second;

    function FailingMockToken(address _tokenFactory, bool _second) MiniMeToken(   
      _tokenFactory,
      0x0,                    // no parent token
      0,                      // no snapshot block number from parent
      "Failing Mock Token", // Token name
      18,                     // Decimals
      "MOCK",                 // Symbol
      true                   // Enable transfers
      ) 
      {
        second = _second;
      }

    function generateTokens(address _owner, uint _amount) onlyController returns (bool) {
        require(false);
        return false;
    }

}