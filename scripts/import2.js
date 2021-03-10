// Match database entries to airtable entries to add additional plaqeues/crystals & shippng addresses

require('dotenv').config({ path: '../.env' });
const csv = require('csvtojson');

const _ = require('lodash');
const models = require('../src/database/models');
models.sequelize.config.logging = false;
const memberBusinessLogic = require('../src/businessLogic/member');
let Op = models.Sequelize.Op;
let Sequelize = models.Sequelize;
// let profileRows = parser(
//   fs.readFileSync('./complete-profiles.csv'),
// );

let count = 0;

async function main() {
  let airtabledata = await csv().fromFile(
    './source/airtable.csv',
  );

  let finds = [];

  for (const airtableRow of airtabledata) {
    finds.push(findit(airtableRow));
  }

  await Promise.all(finds);

  console.log(`done. ${count} not matched `);

  process.exit();
}

main();

async function findit(airtableRow) {
  try {
    let member = await models.member.findAll({
      where: {
        [Op.or]: [
          {
            profileEmail: airtableRow.Email.toLowerCase(),
          },

          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('name')),
            'LIKE',
            `%${airtableRow.Name.toLowerCase()}%`,
          ),

          // { name: { Op.iLike: airtableRow.Name } },
        ],
      },
    });

    if (member.length) {
      await member[0].update({
        additionalPlaques:
          airtableRow['Additional Plauqes'] || 0,
        additionalCrystals:
          airtableRow['Additional Crystals'] || 0,
        shippingAddress1:
          airtableRow['Address Line 1'] || '',
        shippingAddress2:
          airtableRow['Address Line 2'] || '',
        shippingAddressCity: airtableRow['City'] || '',
        shippingAddressState: memberBusinessLogic.parseState(
          airtableRow['State'],
        ),
        shippingAddressZip: airtableRow['Zip'] || '',
      });
    } else {
      member = await models.member.findAll({
        where: {
          name: {
            [models.Sequelize.Op.eq]: airtableRow.Name,
          },
        },
      });
      count++;
    }

    //   if (!member.length === 1)
    console.log(
      airtableRow.Email.toLowerCase(),
      member.length,
    );
  } catch (error) {
    console.error(error);
    console.log(airtableRow);
    process.exit();
  }
}
