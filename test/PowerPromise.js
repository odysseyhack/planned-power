/*
 * Copyright 2019 VMware, all rights reserved.
 */

const PowerPromise = artifacts.require("PowerPromise");

contract("PowerPromise Test", async accounts => {
  let powerPromise;

  it("should store the promise and be retrievable", async () => {
    // MUst change default from account, because AdminUpgrade
    await PowerPromise.defaults({from: accounts[0]});
    powerPromise = await PowerPromise.deployed();

    expect(powerPromise.usages).to.equal(0);

    this.powerPromiseService.promise({
      region: 'Beijum',
      startday: '01-01-1010',
      starttime: '11:30, ',
      endday: '02-02-2020',
      endtime: '23:34',
      fullcapicity: 100,
      minimalcapacity: 20,
      begincapacity: 80
    }).pipe(
      flatMap(() => this.powerPromiseService.retrieve())
    ).subscribe(console.log);


    await powerPromise.promise('Beijum', '01-01-1010', '11:30, ', '02-02-2020', '23:34', 100, 20, 80);
    expect(powerPromise.usages).to.be(1);
  });

});
