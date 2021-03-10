const schema = `
  input MemberFilterInput {
    id: String
    name: String
    membershipYearRange: [ Int ]
    status: MemberStatusEnum
    subscriptionStatus: MemberSubscriptionStatusEnum
    subscriptionLevel: MemberSubscriptionLevelEnum
    stripeCustomerId: String
    createdAtRange: [ DateTime ]
    subscriptionRenewsAtRange: [ DateTime ]
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
