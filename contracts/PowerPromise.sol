pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

contract PowerPromise {

  PowerUse[] usages;

  struct PowerUse {
    string region;
    string startday;
    string starttime;
    string endday;
    string endtime;
    uint8 begincapacity;
    uint8 minimalcapacity;
    uint8 fullcapicity;
  }

  event NewPowerPromise(PowerUse);

  function promise(
    string region,
    string startday,
    string starttime,
    string endday,
    string endtime,
    uint8 begincapacity,
    uint8 minimalcapacity,
    uint8 fullcapicity
  ) {
    uint length = usages.push(PowerUse(region, startday, starttime, endday, endtime, begincapacity, minimalcapacity, fullcapicity));
    emit NewPowerPromise(usages[length - 1]);
  }

  function retrieve() view returns (PowerUse[]) {
    return usages;
  }
}
