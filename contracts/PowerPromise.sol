pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

contract PowerPromise {

  mapping(address => PowerUse[]) usage;

  struct PowerUse {
    uint payload;
    uint usage;
    string from_date;
    string to_date;
    string postcode;
  }

  event NewPowerPromise();

  function promise(PowerUse memory promise) {
    usage[msg.sender].push(promise);
    emit NewPowerPromise();
  }


}
