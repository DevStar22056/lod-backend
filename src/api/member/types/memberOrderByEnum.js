const schema = `
  enum MemberOrderByEnum {
    id_ASC
    id_DESC
    name_ASC
    name_DESC
    membershipYear_ASC
    membershipYear_DESC
    status_ASC
    status_DESC
    subscriptionStatus_ASC
    subscriptionStatus_DESC
    subscriptionLevel_ASC
    subscriptionLevel_DESC
    stripeSubscriptionStartedAt_ASC
    stripeSubscriptionStartedAt_DESC
    subscriptionRenewsAt_ASC
    subscriptionRenewsAt_DESC
    createdAt_ASC
    createdAt_DESC
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
