pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

contract PowerPromise {

  PowerUse[] usages;

  struct PowerUse {
    uint payload;
    uint usage;
    string from_date;
    string to_date;
    string postcode;
  }

  event NewPowerPromise();

  function promise(uint payload, uint use, string from_date, string to_date, string postcode) {
    usages.push(PowerUse(payload, use, from_date, to_date, postcode));
    emit NewPowerPromise();
  }

}
