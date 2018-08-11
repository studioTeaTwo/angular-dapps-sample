pragma solidity ^0.4.23;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

contract MatchCoin is  MintableToken, BurnableToken {
    string public name = "MatchCoin";
    string public symbol = "MTC";
    uint public decimals = 18;
    uint public initialSupply = 100000000 * (10 ** decimals);

    function MatchCoin() public {
        totalSupply_ = initialSupply;
        balances[msg.sender] = initialSupply;
    }
}
