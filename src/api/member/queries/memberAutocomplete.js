const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;
const MemberService = require('../../../services/memberService');

const schema = `
  memberAutocomplete(query: String, limit: Int): [AutocompleteOption!]!
`;

const resolver = {
  memberAutocomplete: async (root, args, context, info) => {
    new PermissionChecker(context)
      .validateHas(permissions.memberAutocomplete);

    return new MemberService(context).findAllAutocomplete(
      args.query,
      args.limit,
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
