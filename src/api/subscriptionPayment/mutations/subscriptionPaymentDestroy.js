const SubscriptionPaymentService = require('../../../services/subscriptionPaymentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  subscriptionPaymentDestroy(ids: [String!]!): Boolean
`;

const resolver = {
  subscriptionPaymentDestroy: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.subscriptionPaymentDestroy);

    await new SubscriptionPaymentService(context).destroyAll(
      args.ids
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
