// FOR EVERY STRIPE SUBSCRIPTION ID IN THE DATABASE, RETRIEVE THE SUBSCRIPTION AND UPDATE THE STRIPE COLUMNS IN THE DB

require('dotenv').config({ path: '../.env' });
const _ = require('lodash');
const models = require('../src/database/models');
models.sequelize.config.logging = false;
let Op = models.Sequelize.Op;
const stripe = require('stripe')(
  process.env.STRIPE_SECRET_KEY,
);
const memberBusinessLogic = require('../src/businessLogic/member');

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
            [Op.gt]: new Date('12/15/19'),
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
  if (!member.stripeCustomerId) return;
  let result = await stripe.customers.retrieve(
    member.stripeCustomerId,
  );

  let membershipYear = memberBusinessLogic.membershipYearForSignupDate(
    new Date(result.created * 1000),
  );
  console.log(membershipYear);

  await member.update({
    membershipYear: membershipYear,
  });
}
