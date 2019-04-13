pragma solidity >=0.4.21 <0.6.0;
// pragma experimental ABIEncoderV2;

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

  event NewPowerPromise(string, string, string, string, string, uint8, uint8, uint8);

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
    PowerUse storage usage = usages[length - 1];

    emit NewPowerPromise(
      usage.region,
      usage.startday,
      usage.starttime,
      usage.endday,
      usage.endtime,
      usage.begincapacity,
      usage.minimalcapacity,
      usage.fullcapicity
    );
  }

  function getLength()
  public
  view
  returns (uint)
  {
    return (usages.length);
  }

  function getPowerPromise(uint index) public view returns (string, string, string, string, string, uint8, uint8, uint8) {
    PowerUse memory use = usages[index];
    return (
    use.region,
    use.startday, use.starttime,
    use.endday, use.endtime,
    use.begincapacity,
    use.minimalcapacity,
    use.fullcapicity
    );
  }

}
