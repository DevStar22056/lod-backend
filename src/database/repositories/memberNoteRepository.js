const models = require('../models');
const SequelizeFilter = require('../utils/sequelizeFilter');
const SequelizeAutocompleteFilter = require('../utils/sequelizeAutocompleteFilter');
const AbstractRepository = require('./abstractRepository');
const AuditLogRepository = require('./auditLogRepository');
const FileRepository = require('./fileRepository');
const lodash = require('lodash');

class MemberNoteRepository extends AbstractRepository {
  constructor() {
    super();

    this.inTableAttributes = [
      'id',
      'note',
      'memberId',
      'updatedAt',
      'createdAt',
    ];

    this.fileAttributes = ['profileImage'];

    this.relationToOneAttributes = {
      updatedBy: {
        model: models.user,
        as: 'updatedBy',
      },
    };

    this.relationToManyAttributes = {
      shipments: {
        model: models.shipment,
        as: 'shipments',
      },
    };
  }

  async create(data, options) {
    const record = await models.memberNote.create(
      {
        ...lodash.pick(data, this.inTableAttributes),
        createdById: AbstractRepository.getCurrentUser(
          options,
        ).id,
        updatedById: AbstractRepository.getCurrentUser(
          options,
        ).id,
      },
      {
        transaction: AbstractRepository.getTransaction(
          options,
        ),
      },
    );
    return record;
  }

  async update(id, data, options) {
    let record = await models.memberNote.findByPk(id, {
      transaction: AbstractRepository.getTransaction(
        options,
      ),
    });

    record = await record.update(
      {
        ...lodash.pick(data, this.inTableAttributes),
        updatedById: AbstractRepository.getCurrentUser(
          options,
        ).id,
      },
      {
        transaction: AbstractRepository.getTransaction(
          options,
        ),
      },
    );

    return record;
  }

  async destroy(id, options) {
    let record = await models.memberNote.findByPk(id, {
      transaction: AbstractRepository.getTransaction(
        options,
      ),
    });

    await record.destroy({
      transaction: AbstractRepository.getTransaction(
        options,
      ),
    });
  }

  async findById(id, options) {
    const record = await models.memberNote.findByPk(id, {
      include: this._buildIncludeForQueries(),
      transaction: AbstractRepository.getTransaction(
        options,
      ),
    });

    return this._fillNonTableAttributesForRecord(
      record,
      null,
      options,
    );
  }

  _buildIncludeForQueries(attributes, includeToAppend) {
    if (!attributes) {
      return Object.keys(this.relationToOneAttributes).map(
        (key) => this.relationToOneAttributes[key],
      );
    }

    const attributesToInclude = lodash.intersection(
      attributes,
      Object.keys(this.relationToOneAttributes),
    );

    const nonIncludedYet = attributesToInclude.filter(
      (attribute) =>
        !includeToAppend.some(
          (included) => included.as === attribute,
        ),
    );

    return nonIncludedYet
      .map(
        (attribute) =>
          this.relationToOneAttributes[attribute],
      )
      .concat(includeToAppend);
  }

  async _fillNonTableAttributesForRows(
    rows,
    requestedAttributes,
    options,
  ) {
    if (!rows) {
      return rows;
    }

    return Promise.all(
      rows.map((record) =>
        this._fillNonTableAttributesForRecord(
          record,
          requestedAttributes,
          options,
        ),
      ),
    );
  }

  async _fillNonTableAttributesForRecord(
    record,
    requestedAttributes,
    options,
  ) {
    if (!record) {
      return record;
    }

    function isRequestedAttribute(fieldName) {
      if (
        !requestedAttributes ||
        requestedAttributes.length
      ) {
        return true;
      }

      return requestedAttributes.includes(fieldName);
    }

    const output = record.get({ plain: true });

    const fields = Object.keys(
      this.relationToManyAttributes,
    )
      .concat(this.fileAttributes)
      .filter(isRequestedAttribute);

    for (const field of fields) {
      output[field] = await record[
        `get${AbstractRepository.jsUcfirst(field)}`
      ]({
        transaction: AbstractRepository.getTransaction(
          options,
        ),
      });
    }

    return output;
  }

  async findAndCountAllById(id, options) {
    
    let {
      rows,
      count,
    } = await models.memberNote.findAndCountAll({
      where: {memberId: id},
      include: this._buildIncludeForQueries(),
      order: [['createdAt', 'DESC']],
      transaction: AbstractRepository.getTransaction(
        options,
      ),
    });

    return { rows, count };
  }

  async findAndCountAll(
    {
      requestedAttributes,
      filter,
      limit,
      offset,
      orderBy,
    } = {
      requestedAttributes: null,
      filter: null,
      limit: 0,
      offset: 0,
      orderBy: null,
    },
    options,
  ) {
    let sequelizeFilter = new SequelizeFilter(
      models.Sequelize,
    );

    const include = this._buildIncludeForQueries(
      requestedAttributes,
      sequelizeFilter.getInclude(),
    );

    const requestedAttributesInTable =
      requestedAttributes && requestedAttributes.length
        ? [
            'id',
            ...lodash.intersection(
              this.inTableAttributes,
              requestedAttributes,
            ),
          ]
        : undefined;

    let {
      rows,
      count,
    } = await models.memberNote.findAndCountAll({
      where: sequelizeFilter.getWhere(),
      include,
      attributes: requestedAttributesInTable,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: orderBy
        ? [orderBy.split('_')]
        : [['createdAt', 'DESC']],
      transaction: AbstractRepository.getTransaction(
        options,
      ),
    });

    return { rows, count };
  }
}

module.exports = MemberNoteRepository;
