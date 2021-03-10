const mergeResolvers = require('./shared/utils/mergeGraphqlResolvers');

const sharedTypes = require('./shared/types');

const settingsTypes = require('./settings/types');
const settingsQueries = require('./settings/queries');
const settingsMutations = require('./settings/mutations');

const authTypes = require('./auth/types');
const authQueries = require('./auth/queries');
const authMutations = require('./auth/mutations');

const iamTypes = require('./iam/types');
const iamQueries = require('./iam/queries');
const iamMutations = require('./iam/mutations');

const auditLogTypes = require('./auditLog/types');
const auditLogQueries = require('./auditLog/queries');
const auditLogMutations = require('./auditLog/mutations');

const memberTypes = require('./member/types');
const memberQueries = require('./member/queries');
const memberMutations = require('./member/mutations');

const shipmentTypes = require('./shipment/types');
const shipmentQueries = require('./shipment/queries');
const shipmentMutations = require('./shipment/mutations');

const skuTypes = require('./sku/types');
const skuQueries = require('./sku/queries');
const skuMutations = require('./sku/mutations');

const subscriptionPaymentTypes = require('./subscriptionPayment/types');
const subscriptionPaymentQueries = require('./subscriptionPayment/queries');
const subscriptionPaymentMutations = require('./subscriptionPayment/mutations');

const types = [
  ...sharedTypes,
  ...iamTypes,
  ...authTypes,
  ...auditLogTypes,
  ...settingsTypes,
  ...memberTypes,
  ...shipmentTypes,
  ...skuTypes,
  ...subscriptionPaymentTypes,
].map((type) => type.resolver);

const queries = [
  ...iamQueries,
  ...authQueries,
  ...auditLogQueries,
  ...settingsQueries,
  ...memberQueries,
  ...shipmentQueries,
  ...skuQueries,
  ...subscriptionPaymentQueries,
].map((query) => query.resolver);

const mutations = [
  ...iamMutations,
  ...authMutations,
  ...auditLogMutations,
  ...settingsMutations,
  ...memberMutations,
  ...shipmentMutations,
  ...skuMutations,
  ...subscriptionPaymentMutations,
].map((mutation) => mutation.resolver);

module.exports = mergeResolvers(types, queries, mutations);
