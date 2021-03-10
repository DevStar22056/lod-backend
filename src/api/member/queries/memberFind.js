const MemberService = require('../../../services/memberService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  memberFind(id: String!): Member!
`;

const resolver = {
  memberFind: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.memberRead);

    return new MemberService(context).findById(args.id);
  },
};

exports.schema = schema;
exports.resolver = resolver;
