const schema = `
  enum MemberStatusEnum {
    pending
    active
    suspended
    canceled
    denied
  }

  enum MemberSubscriptionStatusEnum {
    trialing
    active
    past_due
    unpaid
    canceled
  }

  enum MemberSubscriptionLevelEnum {
    charter
    featured
    distinguished
  }

`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
