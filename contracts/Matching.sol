pragma solidity ^0.4.23;

contract Matching {

  struct Personal {
    uint256 perId;
    uint like;
    uint disLike;
  }

  struct Match {
    address addr;
    uint64 time;
  }

  Personal[] Personals;
  Match[] Matches;

  mapping (address => uint256) internal matchingAddr;

  event Like(address owner, uint256 like);
  event DisLike(address owner, uint256 disLike);
  event Send(address owner, uint256 matchId);
  event Matching(address owner, uint256 matchId);

  constructor() public {
    Personals.push(Personal(1, 0, 0));
    Personals.push(Personal(2, 0, 0));
    Personals.push(Personal(3, 0, 0));
    Personals.push(Personal(4, 0, 0));
    Personals.push(Personal(5, 0, 0));
    Personals.push(Personal(6, 0, 0));
    Personals.push(Personal(7, 0, 0));
    Personals.push(Personal(8, 0, 0));
    Personals.push(Personal(9, 0, 0));
    Personals.push(Personal(10, 0, 0));
  }

  /**
  * like
  */
  function like(uint256 _perId) external {

    Personals[_perId].like = Personals[_perId].like + 1;

    emit Like(msg.sender, Personals[_perId].like);
  }

  /**
  * disLike
  */
  function disLike(uint256 _perId) external {

    Personals[_perId].disLike = Personals[_perId].disLike + 1;

    emit DisLike(msg.sender, Personals[_perId].disLike);
  }

  /**
  * send
  */
  function send(address _target) external payable {
    _target.transfer(msg.value);
  }

  /**
  * matching
  */
  function matching(address _addr) external returns(uint256) {

    Match memory matching = Match({
      addr: _addr,
      time: uint64(now)
    });

    uint256 matchId = Matches.push(matching) - 1;

    matchingAddr[msg.sender] = matchId;

    emit Matching(msg.sender, matchId);

    return matchId;
  }
}
