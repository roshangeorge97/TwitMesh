const SupplyChain = artifacts.require("IPFSHashStorage");

module.exports = function (deployer) {
    deployer.deploy(SupplyChain);
};
