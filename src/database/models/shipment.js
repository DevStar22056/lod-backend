const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const shipment = sequelize.define(
    'shipment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      shipped: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      shipmentYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 2030,
        },
      },
      trackingId: {
        type: DataTypes.TEXT,
      },
      notes: {
        type: DataTypes.TEXT,
      },
      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  const shipmentSku = sequelize.define('shipmentSku', {
    quantity: {
      type: DataTypes.INTEGER,
    },
  });

  shipment.associate = (models) => {
    models.shipment.belongsToMany(models.sku, {
      as: 'sku',
      constraints: false,
      through: shipmentSku,
    });

    models.shipment.belongsTo(models.member, {
      as: 'member',
      constraints: false,
    });

    models.shipment.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.shipment.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return shipment;
};
