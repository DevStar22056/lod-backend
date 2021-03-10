const SubscriptionPaymentService = require('../../../services/subscriptionPaymentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;
const graphqlSelectRequestedAttributes = require('../../shared/utils/graphqlSelectRequestedAttributes');

const schema = `
  subscriptionPaymentList(filter: SubscriptionPaymentFilterInput, limit: Int, offset: Int, orderBy: SubscriptionPaymentOrderByEnum): SubscriptionPaymentPage!
`;

const resolver = {
  subscriptionPaymentList: async (root, args, context, info) => {
    new PermissionChecker(context)
      .validateHas(permissions.subscriptionPaymentRead);

    return new SubscriptionPaymentService(context).findAndCountAll({
      ...args,
      requestedAttributes: graphqlSelectRequestedAttributes(
        info,
        'rows',
      ),
    });
  },
};

exports.schema = schema;
exports.resolver = resolver;
