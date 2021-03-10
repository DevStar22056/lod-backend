const schema = `
  input MemberInput {
    isInternational: Boolean
    profileImage: [ FileInput! ]
    name: String!
    firstName: String!
    lastName: String!
    location: String!
    membershipYear: Int!
    status: MemberStatusEnum!
    subscriptionLevel: MemberSubscriptionLevelEnum!
    subscriptionRenewsAt: DateTime
    stripeSubscriptionStartedAt: DateTime
    additionalCrystals: Int
    additionalPlaques: Int
    stripeSubscriptionId: String
    stripeCustomerId: String
    practiceAddress1: String!
    practiceAddress2: String
    practiceAddressCity: String!
    practiceAddressState: String!
    practiceAddressZip: String!
    practiceAddressCountry: String
    shipments: [ String! ]
    payments: [ String! ]
    shippingAddress1: String!
    shippingAddress2: String
    shippingAddressCity: String!
    shippingAddressState: String!
    shippingAddressZip: String!
    shippingAddressCountry: String
    profileId: String
    slug: String
    profileDescription: String
    profileEmail: String!
    profileFacebook: String
    profileTwitter: String
    profileWebsite: String
    profileLastSynced: DateTime
    profileSpecialization: String
    profileAvvoReview: String
    profileAvvoRating: Int
    profileGoogleReview: String
    profileGoogleRating: Int
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
