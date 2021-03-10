const models = require('../database/models');

module.exports = {
  generateMemberShipment: async function(
    member,
    subscriptionPayment,
    includeWelcomePack,
  ) {
    // make sure we have a successful first payment
    let invoiceObject = JSON.parse(
      subscriptionPayment.stripeInvoice,
    );

    if (member.status !== 'active') {
      console.log(
        `Shipment not created for payment ${invoiceObject.id} because member is in '${member.status}' status.`,
      );
      return;
      //   throw new Error('Member is not active');
    }

    // make sure we have a successful first payment
    if (invoiceObject.status !== 'paid') {
      console.log(
        `Shipment not created for payment ${invoiceObject.id} because invoice is in '${invoiceObject.status}' status.`,
      );
      return;
      //   throw new Error('Invoice not paid');
    }

    // send welcome kit and first shipment
    const shipmentYear = module.exports.shipmentYearForInvoice(
      invoiceObject,
    );

    const newShipment = await module.exports.createAnualShipment(
      member,
      shipmentYear,
      includeWelcomePack,
    );

    console.log(
      `${shipmentYear} ${
        includeWelcomePack ? 'WELCOME' : ''
      } shipment #${newShipment.id} for ${member.get(
        'name',
      )}. Source ${shipmentYear} subscription payment of $${invoiceObject.total /
        100}`,
    );
  },

  createAnualShipment: async function(
    member,
    shipmentYear,
    includeWelcomePack = false,
  ) {
    let shipmentItems = {
      plaques: 0,
      crystals: 0,
      welcomeKits: 0,
    };

    let [welcomeKitSKU] = await models.sku.findOrCreate({
      where: {
        year: shipmentYear,
        name: `${shipmentYear} Welcome Kit`,
      },
      defaults: {
        description: `Welcome Kit for new ${shipmentYear} members.`,
      },
    });

    var [plaqueSKU] = await models.sku.findOrCreate({
      where: {
        year: shipmentYear,
        name: `${shipmentYear} Plaque`,
      },
      defaults: {
        description: `${shipmentYear} membership plaque.`,
      },
    });

    var [crystalSKU] = await models.sku.findOrCreate({
      where: {
        year: shipmentYear,
        name: `${shipmentYear} Crystal`,
      },
      defaults: {
        description: `${shipmentYear} membership crystal.`,
      },
    });

    if (includeWelcomePack) {
      shipmentItems.welcomeKits++;
    }

    // find the SKUS to be added to the shipment
    switch (member.subscriptionLevel) {
      case 'charter':
      case 'featured':
        shipmentItems.plaques++;

        break;
      case 'distinguished':
        shipmentItems.plaques++;
        shipmentItems.crystals++;

        break;
      default:
        console.error(
          `Unknown member type ${this.get(
            'subscriptionLevel',
          )}`,
        );
        break;
    }

    shipmentItems.plaques += member.additionalPlaques;
    shipmentItems.crystals += member.additionalCrystals;

    let shipment = await models.shipment.create({
      shipped: false,
      shipmentYear,
    });

    await member.addShipment(shipment);

    if (shipmentItems.welcomeKits) {
      await shipment.addSku(welcomeKitSKU, {
        through: { quantity: 1 },
      });
    }
    if (shipmentItems.plaques) {
      await shipment.addSku(plaqueSKU, {
        through: { quantity: shipmentItems.plaques },
      });
    }
    if (shipmentItems.crystals) {
      await shipment.addSku(crystalSKU, {
        through: { quantity: shipmentItems.crystals },
      });
    }

    return shipment;
  },

  shipmentYearForInvoice: function(stripeInvoice) {
    const invoiceDueAt = new Date(
      stripeInvoice.finalized_at * 1000,
    );
    const currentYear = new Date().getFullYear();
    const cutoffDate = new Date(`11/8/${currentYear}`);
    const shipmentYear =
      invoiceDueAt < cutoffDate
        ? currentYear
        : currentYear + 1;

    return shipmentYear;
  },
};
