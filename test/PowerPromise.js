/*
 * Copyright 2019 VMware, all rights reserved.
 */

const PowerPromise = artifacts.require("PowerPromise");

contract("PowerPromise Test", async accounts => {
  let powerPromise;

  it("should store and create an order", async () => {
    // MUst change default from account, because AdminUpgrade
    await PowerPromise.defaults({from: accounts[0]});
    powerPromise = await PowerPromise.deployed();

    await powerPromise.promise('9725', '2019-01-01', '15:00', '2019-01-01', '18:00', 60, 30, 100);
    const promises = await powerPromise.retrieve();

    expect(promises.length).to.equal(1);
  });

});
