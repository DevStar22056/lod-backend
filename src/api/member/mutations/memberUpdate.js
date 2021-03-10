const MemberService = require('../../../services/memberService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  memberUpdate(id: String!, data: MemberInput!): Member!
`;

const resolver = {
  memberUpdate: async (root, args, context) => {
    new PermissionChecker(context).validateHas(
      permissions.memberEdit,
    );

    return new MemberService(context).update(
      args.id,
      args.data,
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
