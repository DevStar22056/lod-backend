const MemberService = require('../../../services/memberService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  memberCreate(data: MemberInput!): Member!
`;

const resolver = {
  memberCreate: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.memberCreate);

    return new MemberService(context).create(
      args.data
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
