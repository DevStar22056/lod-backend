const MemberNoteService = require('../../../services/memberNoteService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;

const schema = `
  memberNoteDestroy(ids: [String!]!): Boolean
`;

const resolver = {
  memberNoteDestroy: async (root, args, context) => {
    new PermissionChecker(context)
      .validateHas(permissions.memberNoteDestroy);

    await new MemberNoteService(context).destroyAll(
      args.ids
    );

    return true;
  },
};

exports.schema = schema;
exports.resolver = resolver;
