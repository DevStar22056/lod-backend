const MemberNoteService = require('../../../services/memberNoteService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  memberNoteListById(id: String!): MemberNotePage!
`;

const resolver = {
  memberNoteListById: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.memberNoteRead);

    return new MemberNoteService(context).findByMemberId(args.id);
  },
};

exports.schema = schema;
exports.resolver = resolver;
