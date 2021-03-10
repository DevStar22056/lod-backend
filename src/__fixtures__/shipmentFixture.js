const genericFixture = require('./genericFixture');
const ShipmentRepository = require('../database/repositories/shipmentRepository');

const shipmentFixture = genericFixture({
  idField: 'id',
  createFn: (data) => new ShipmentRepository().create(data),
  data: [
    {
      id: '1',
      // Add attributes here
    },
  ],
});

module.exports = shipmentFixture;
