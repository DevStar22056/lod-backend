const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const sku = sequelize.define(
    'sku',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 2019,
          max: 2030,
        }
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [2, 255],
          notEmpty: true,
        }
      },
      description: {
        type: DataTypes.TEXT,
        validate: {

        }
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

  sku.associate = (models) => {


    models.sku.hasMany(models.file, {
      as: 'photos',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.sku.getTableName(),
        belongsToColumn: 'photos',
      },
    });

    models.sku.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.sku.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return sku;
};
