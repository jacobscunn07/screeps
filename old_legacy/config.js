var builderClass = require("class.builder");
var minerClass = require("class.miner");
var repairerClass = require("class.repairer");
var transporterClass = require("class.transporter");
var upgraderClass = require("class.upgrader");
var creepFactoryClass = require("factory.creep");

module.exports = {
  register: function() {
    /* Creep Classes */
    builderClass.register();
    minerClass.register();
    repairerClass.register();
    transporterClass.register();
    upgraderClass.register();

    /* Factory Classes */
    creepFactoryClass.register();

    /* Structure Classes */
  }
}
