const MemberNoteService = require('../../../services/memberNoteService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  memberNoteCreate(data: MemberNoteInput!): MemberNote!
`;

const resolver = {
  memberNoteCreate: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.memberNoteCreate);

    return new MemberNoteService(context).create(
      args.data
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
