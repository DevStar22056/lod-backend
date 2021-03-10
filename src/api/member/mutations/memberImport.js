const MemberService = require('../../../services/memberService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  memberImport(data: MemberInput!, importHash: String!): Boolean
`;

const resolver = {
  memberImport: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.memberImport);

    await new MemberService(context).import(
      args.data,
      args.importHash
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
