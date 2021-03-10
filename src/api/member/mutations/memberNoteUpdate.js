const MemberNoteService = require('../../../services/memberNoteService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  memberNoteUpdate(id: String!, data: MemberNoteInput!): MemberNote!
`;

const resolver = {
  memberNoteUpdate: async (root, args, context) => {
    new PermissionChecker(context).validateHas(
      permissions.memberNoteEdit,
    );

    return new MemberNoteService(context).update(
      args.id,
      args.data,
    );
  },
};

exports.schema = schema;
exports.resolver = resolver;
