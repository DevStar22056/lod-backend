const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;
const ShipmentService = require('../../../services/shipmentService');

const schema = `
  shipmentAutocomplete(query: String, limit: Int): [AutocompleteOption!]!
`;

const resolver = {
  shipmentAutocomplete: async (root, args, context, info) => {
    new PermissionChecker(context)
      .validateHas(permissions.shipmentAutocomplete);

    return new ShipmentService(context).findAllAutocomplete(
      args.query,
      args.limit,
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
