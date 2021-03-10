const userFixture = require('./userFixture');
const memberFixture = require('./memberFixture');
const shipmentFixture = require('./shipmentFixture');
const skuFixture = require('./skuFixture');
const subscriptionPaymentFixture = require('./subscriptionPaymentFixture');
const AbstractRepository = require('../database/repositories/abstractRepository');

module.exports = {
  user: userFixture,
  member: memberFixture,
  shipment: shipmentFixture,
  sku: skuFixture,
  subscriptionPayment: subscriptionPaymentFixture,

  async cleanDatabase() {
    await AbstractRepository.cleanDatabase();
  },
};
