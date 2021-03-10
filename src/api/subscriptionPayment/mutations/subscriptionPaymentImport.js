const SubscriptionPaymentService = require('../../../services/subscriptionPaymentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  subscriptionPaymentImport(data: SubscriptionPaymentInput!, importHash: String!): Boolean
`;

const resolver = {
  subscriptionPaymentImport: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.subscriptionPaymentImport);

    await new SubscriptionPaymentService(context).import(
      args.data,
      args.importHash
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
