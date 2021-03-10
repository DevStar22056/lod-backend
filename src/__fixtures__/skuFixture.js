const genericFixture = require('./genericFixture');
const SkuRepository = require('../database/repositories/skuRepository');

const skuFixture = genericFixture({
  idField: 'id',
  createFn: (data) => new SkuRepository().create(data),
  data: [
    {
      id: '1',
      // Add attributes here
    },
  ],
});

module.exports = skuFixture;
