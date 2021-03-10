const genericFixture = require('./genericFixture');
const MemberRepository = require('../database/repositories/memberRepository');

const memberFixture = genericFixture({
  idField: 'id',
  createFn: (data) => new MemberRepository().create(data),
  data: [
    {
      id: '1',
      // Add attributes here
    },
  ],
});

module.exports = memberFixture;
