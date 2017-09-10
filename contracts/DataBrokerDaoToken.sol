pragma solidity ^0.4.15;

import "./MiniMeToken.sol";


contract DataBrokerDaoToken is MiniMeToken {  

    function DataBrokerDaoToken(address _tokenFactory) MiniMeToken(   
      _tokenFactory,
      0x0,                    // no parent token
      0,                      // no snapshot block number from parent
      "DataBroker DAO Token", // Token name
      18,                     // Decimals
      "DATA",                 // Symbol
      true                   // Enable transfers
      ) 
      {}

}