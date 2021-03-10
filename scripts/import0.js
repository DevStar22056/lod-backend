// match profile info with stripe info and chase's email address list

const fs = require('fs');
const parser = require('csv-parse/lib/sync');
const _ = require('lodash');

const wpProfiles = require('./wp-export-10-6.json');
const chaseProfiles = parser(
  fs.readFileSync('./profile-info.csv'),
);
const stripeSubscriptions = parser(
  fs.readFileSync('./source/stripe-subscriptions.csv'),
);

let profiles = [];
let stats = [0, 0, 0];

function findStripeSubscriptionByEmail(email) {
  return stripeSubscriptions.find(
    (s) => s[3].toLowerCase() === email.toLowerCase(),
  );
}

function findStripeSubscriptionByFullName(fullName) {
  return stripeSubscriptions.find(
    (s) => s[2].toLowerCase() === fullName.toLowerCase(),
  );
}

function findChaseProfileBySlug(slug) {
  return chaseProfiles.find(
    (p) =>
      p[3].toLowerCase().indexOf(slug.toLowerCase()) !== -1,
  );
}

function findChaseProfileByFirstLAst(first, last) {
  //   console.log(first, last);
  return chaseProfiles.find(
    (p) =>
      p[1].toLowerCase() == first.toLowerCase() &&
      p[2].toLowerCase() == last.toLowerCase(),
  );
}

function findWPProfileByFirstLAst(first, last) {
  return wpProfiles.find(
    (p) =>
      p.first_name.toLowerCase() == first.toLowerCase() &&
      p.last_name.toLowerCase() == last.toLowerCase(),
  );
}

function getSlug(row) {
  return row[3]
    .replace(
      'https://www.thelawyersofdistinction.com/profile/',
      '',
    )
    .replace('/', '');
}

function main() {
  for (let index = 0; index < wpProfiles.length; index++) {
    let wpProfile = wpProfiles[index];
    wpProfile.email = null;
    wpProfile.stripeSubscriptionId = null;
    wpProfile.stripeCustomerId = null;
    wpProfile.stripeCustomerCreated = null;

    let chaseProfile = findChaseProfileBySlug(
      wpProfile.slug,
    );

    if (!chaseProfile)
      chaseProfile = findChaseProfileByFirstLAst(
        wpProfile.first_name,
        wpProfile.last_name,
      );

    if (chaseProfile) {
      wpProfile.email = chaseProfile[0];
      stats[0]++;
    }

    let sub = wpProfile.email
      ? findStripeSubscriptionByEmail(wpProfile.email)
      : null;

    if (!sub) {
      sub = findStripeSubscriptionByFullName(
        `${wpProfile.first_name} ${wpProfile.last_name}`,
      );
    }

    if (sub) {
      stats[1]++;

      wpProfile.stripeSubscriptionId = sub[0];
      wpProfile.stripeCustomerId = sub[1];
      wpProfile.stripeCustomerCreated = sub[9];
      if (!wpProfile.email) {
        wpProfile.email = sub[3];
      }
    } else {
      wpProfile.stripeSubscriptionId = '';
    }

    console.log(
      wpProfile.email,
      wpProfile.stripeSubscriptionId,
    );
  }

  console.log(chaseProfiles.length, 'total chase profiles');
  console.log(
    wpProfiles.length,
    'wp profiles total',
    stats[0],
    'matched',
  );
  console.log(
    stripeSubscriptions.length,
    'total stripe subscriptions',
    stats[1],
    'matched',
  );

  console.log(profiles.length, ' full profiles');

  const fastcsv = require('fast-csv');
  const fs = require('fs');
  const ws = fs.createWriteStream('step0_result.csv');
  fastcsv.write(wpProfiles, { headers: true }).pipe(ws);
}

main();
