const SubscriptionPaymentService = require('../../../services/subscriptionPaymentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  subscriptionPaymentCreate(data: SubscriptionPaymentInput!): SubscriptionPayment!
`;

const resolver = {
  subscriptionPaymentCreate: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.subscriptionPaymentCreate);

    return new SubscriptionPaymentService(context).create(
      args.data
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
