const MemberService = require('../../../services/memberService');
const PermissionChecker = require('../../../services/iam/permissionChecker');
const permissions = require('../../../security/permissions')
  .values;
const graphqlSelectRequestedAttributes = require('../../shared/utils/graphqlSelectRequestedAttributes');

const schema = `
  memberList(filter: MemberFilterInput, limit: Int, offset: Int, orderBy: MemberOrderByEnum): MemberPage!
`;

const resolver = {
  memberList: async (root, args, context, info) => {
    new PermissionChecker(context)
      .validateHas(permissions.memberRead);

    return new MemberService(context).findAndCountAll({
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
