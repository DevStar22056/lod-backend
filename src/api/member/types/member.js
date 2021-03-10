const schema = `
  type Member {
    id: String!
    isInternational: Boolean
    profileImage: [ File! ]
    name: String
    firstName: String
    lastName: String
    location: String
    membershipYear: Int
    status: MemberStatusEnum
    subscriptionStatus: MemberSubscriptionStatusEnum
    subscriptionLevel: MemberSubscriptionLevelEnum
    subscriptionRenewsAt: DateTime
    stripeSubscriptionStartedAt: DateTime
    additionalCrystals: Int
    additionalPlaques: Int
    stripeSubscriptionId: String
    stripeCustomerId: String
    practiceAddress1: String
    practiceAddress2: String
    practiceAddressCity: String
    practiceAddressState: String
    practiceAddressZip: String
    practiceAddressCountry: String
    shipments: [ Shipment! ]
    payments: [ SubscriptionPayment! ]
    shippingAddress1: String
    shippingAddress2: String
    shippingAddressCity: String
    shippingAddressState: String
    shippingAddressZip: String
    shippingAddressCountry: String
    profileId: Int
    slug: String
    profileDescription: String
    profileEmail: String
    profileFacebook: String
    profileTwitter: String
    profileWebsite: String
    profileLastSynced: DateTime
    createdAt: DateTime
    updatedAt: DateTime
    profileSpecialization: String
    profileAvvoReview: String
    profileAvvoRating: Int
    profileGoogleReview: String
    profileGoogleRating: Int
    activedAt: DateTime
    activedBy: User
  }
`;

const resolver = {};

exports.schema = schema;
exports.resolver = resolver;
