const ShipmentService = require('../../../services/shipmentService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;
const graphqlSelectRequestedAttributes = require('../../shared/utils/graphqlSelectRequestedAttributes');

const schema = `
  shipmentList(filter: ShipmentFilterInput, limit: Int, offset: Int, orderBy: ShipmentOrderByEnum): ShipmentPage!
`;

const resolver = {
  shipmentList: async (root, args, context, info) => {
    new PermissionChecker(context)
      .validateHas(permissions.shipmentRead);

    return new ShipmentService(context).findAndCountAll({
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
