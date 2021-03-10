const SubscriptionPaymentService = require('../../../services/subscriptionPaymentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  subscriptionPaymentUpdate(id: String!, data: SubscriptionPaymentInput!): SubscriptionPayment!
`;

const resolver = {
  subscriptionPaymentUpdate: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.subscriptionPaymentEdit);

    return new SubscriptionPaymentService(context).update(
      args.id,
      args.data
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
