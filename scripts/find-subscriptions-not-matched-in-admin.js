// find active Stripe subscriptions that do not match any Member profile in Admin

require('dotenv').config({ path: '../.env' });

const models = require('../src/database/models');
models.sequelize.config.logging = false;
const stripe = require('stripe')(
  process.env.STRIPE_SECRET_KEY,
);

let count = 0;

async function main() {
  for await (const subscription of stripe.subscriptions.list(
    { limit: 100, expand: ['data.customer'] },
  )) {
    let members = await models.member.findAll({
      where: {
        stripeSubscriptionId: subscription.id,
      },
    });

    if (members.length == 0) {
      count++;
      console.log(
        `${subscription.status},${subscription.id},${subscription.customer.description},${subscription.customer.email},`,
      );
    }
  }

  console.log(`done. ${count} not matched `);

  process.exit();
}

main();
