const MemberNoteService = require('../../../services/memberNoteService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  memberNoteFind(id: String!): MemberNote!
`;

const resolver = {
  memberNoteFind: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.memberNoteRead);

    return new MemberNoteService(context).findById(args.id);
  },
};

exports.schema = schema;
exports.resolver = resolver;
