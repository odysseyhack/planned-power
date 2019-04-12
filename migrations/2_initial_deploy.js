/*
 * Copyright 2019 VMware, all rights reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var PowerPromise = artifacts.require("./PowerPromise.sol");


module.exports = function(deployer, network, accounts) {
  let proxyContract;

  deployer.deploy(PowerPromise)
};
