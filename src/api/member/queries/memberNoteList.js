const MemberNoteService = require('../../../services/memberNoteService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;
const graphqlSelectRequestedAttributes = require('../../shared/utils/graphqlSelectRequestedAttributes');

const schema = `
  memberNoteList(filter: MemberNoteFilterInput, limit: Int, offset: Int, orderBy: MemberOrderByEnum): MemberNotePage!
`;

const resolver = {
  memberNoteList: async (root, args, context, info) => {
    new PermissionChecker(context)
      .validateHas(permissions.memberNoteRead);

    return new MemberNoteService(context).findAndCountAll({
      ...args,
      requestedAttributes: graphqlSelectRequestedAttributes(
        info,
        'rows',
      ),
    });
  },
};

exports.schema = schema;
exports.resolver = resolver;
