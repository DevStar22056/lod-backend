const MemberService = require('../../../services/memberService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  memberDestroy(ids: [String!]!): Boolean
`;

const resolver = {
  memberDestroy: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.memberDestroy);

    await new MemberService(context).destroyAll(
      args.ids
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
