require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const parser = require('csv-parse/lib/sync');
const _ = require('lodash');

let profileRows = parser(
  fs.readFileSync(
    './LODFullProfileAndSubscriptions_10-9-19.csv',
  ),
);

function getSlug(profileRow) {
  return profileRow[20];
}

async function main() {
  var WPAPI = require('wpapi');
  var wp = new WPAPI({
    endpoint: process.env.LOD_MEMBER_API_ENDPOINT,
  });

  wp.setHeaders(
    'Authorization',
    `Bearer ${process.env.LOD_MEMBER_API_TOKEN}`,
  );

  wp.lodProfile = wp.registerRoute(
    'lod/v1',
    '/profile//(?P<the_slug>)',
  );

  // add to header row
  var headerRow = profileRows[0];
  let profileIdIndex = headerRow.length;
  headerRow[profileIdIndex] = 'wp_profile_id';

  //   profileRows = profileRows.slice(0, 4);

  for (const profileRow of profileRows) {
    let slug = getSlug(profileRow);
    try {
      let profile = await wp.lodProfile().theSlug(slug);
      profileRow[profileIdIndex] = profile.lawyer_id;
      console.log(`${slug}:${profile.lawyer_id}`);
    } catch (error) {
      console.error(error);
    }
  }

  const fastcsv = require('fast-csv');
  const fs = require('fs');
  const ws = fs.createWriteStream(
    'LODFullProfileAndSubscriptions_10-9-19-wihtids.csv',
  );
  await fastcsv
    .write(profileRows, { headers: true })
    .pipe(ws);
}

main();
