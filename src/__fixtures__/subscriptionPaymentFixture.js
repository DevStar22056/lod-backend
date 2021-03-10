const genericFixture = require('./genericFixture');
const SubscriptionPaymentRepository = require('../database/repositories/subscriptionPaymentRepository');

const subscriptionPaymentFixture = genericFixture({
  idField: 'id',
  createFn: (data) => new SubscriptionPaymentRepository().create(data),
  data: [
    {
      id: '1',
      // Add attributes here
    },
  ],
});

module.exports = subscriptionPaymentFixture;
