const SubscriptionPaymentService = require('../../../services/subscriptionPaymentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  subscriptionPaymentFind(id: String!): SubscriptionPayment!
`;

const resolver = {
  subscriptionPaymentFind: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.subscriptionPaymentRead);

    return new SubscriptionPaymentService(context).findById(args.id);
  },
};

exports.schema = schema;
exports.resolver = resolver;
