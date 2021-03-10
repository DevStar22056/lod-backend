// FOR EVERY STRIPE SUBSCRIPTION ID IN THE DATABASE, RETRIEVE THE SUBSCRIPTION AND UPDATE THE STRIPE COLUMNS IN THE DB

require('dotenv').config({ path: '../.env' });
const _ = require('lodash');
const models = require('../src/database/models');
models.sequelize.config.logging = false;
let Op = models.Sequelize.Op;
const stripe = require('stripe')(
  process.env.STRIPE_SECRET_KEY,
);

let count = 0;

async function main() {
  let members = await models.member.findAll({
    where: {
      [Op.and]: [
        {
          stripeSubscriptionId: {
            [Op.ne]: '',
          },
        },
        {
          createdAt: {
            [Op.gt]: new Date('12/1/19'),
          },
        },
      ],
    },
  });
  console.log(members.length);

  for (const member of members) {
    await update(member);
    console.log(count++);
  }

  console.log(`done. ${count} updates `);

  process.exit();
}

main();

async function update(member) {
  let stripeSubscriptionId = member.stripeSubscriptionId;

  try {
    let result = await stripe.subscriptions.retrieve(
      stripeSubscriptionId,
    );

    let renewalDate =
      result.status !== 'canceled' && !result.canceled_at
        ? new Date(result.current_period_end * 1000)
        : null;

    console.log(
      `${stripeSubscriptionId} | created: ${new Date(
        result.created * 1000,
      )} | renews ${renewalDate} | status ${result.status}`,
    );

    await member.update({
      stripeCustomerId: result.customer,
      subscriptionStatus: result.status,
      stripeSubscriptionStartedAt: new Date(
        result.created * 1000,
      ),
      subscriptionRenewsAt: renewalDate,
    });
  } catch (e) {
    if (!_.startsWith(e.message, 'No such subscription')) {
      console.log(stripeSubscriptionId, e.message);
    } else {
      console.log(`${stripeSubscriptionId} is canceled`);

      await member.update({
        subscriptionStatus: 'canceled',
      });
    }
  }
}
