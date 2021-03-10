const Roles = require('./roles');
const roles = Roles.values;

class Permissions {
  static get values() {
    return {
      iamEdit: {
        id: 'iamEdit',
        allowedRoles: [
          roles.owner,
          roles.iamSecurityReviewer,
          roles.editor,
        ],
        allowedStorageFolders: ['user'],
      },
      iamCreate: {
        id: 'iamCreate',
        allowedRoles: [
          roles.owner,
          roles.iamSecurityReviewer,
          roles.editor,
        ],
      },
      iamImport: {
        id: 'iamImport',
        allowedRoles: [
          roles.owner,
          roles.iamSecurityReviewer,
          roles.editor,
        ],
      },
      iamRead: {
        id: 'iamRead',
        allowedRoles: [
          roles.owner,
          roles.iamSecurityReviewer,
          roles.editor,
          roles.viewer,
        ],
      },
      iamUserAutocomplete: {
        id: 'iamUserAutocomplete',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.viewer,


        ],
      },
      auditLogRead: {
        id: 'auditLogRead',
        allowedRoles: [roles.owner, roles.auditLogViewer, roles.viewer],
      },
      settingsEdit: {
        id: 'settingsEdit',
        allowedRoles: [roles.owner],
      },
      memberImport: {
        id: 'memberImport',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.memberEditor,
        ],
      },
      memberCreate: {
        id: 'memberCreate',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.memberEditor,
        ],
        allowedStorageFolders: ['member'],
      },
      memberEdit: {
        id: 'memberEdit',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.memberEditor,
        ],
        allowedStorageFolders: ['member'],
      },
      memberDestroy: {
        id: 'memberDestroy',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.memberEditor,
        ],
        allowedStorageFolders: ['member'],
      },
      memberRead: {
        id: 'memberRead',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.viewer,
          roles.entityEditor,
          roles.memberEditor,
          roles.memberViewer,
        ],
      },
      memberAutocomplete: {
        id: 'memberAutocomplete',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.viewer,
          roles.entityEditor,
          roles.memberEditor,
          roles.memberViewer,
          roles.shipmentEditor,
          roles.shipmentViewer,
          roles.subscriptionPaymentEditor,
          roles.subscriptionPaymentViewer,
        ],
      },

      memberNoteCreate: {
        id: 'memberNoteCreate',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.memberNoteEditor,
        ],
      },      
      memberNoteEdit: {
        id: 'memberNoteEdit',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.memberNoteEditor,
        ],
      },
      memberNoteDestroy: {
        id: 'memberNoteDestroy',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.memberNoteEditor,
        ],
      },
      memberNoteRead: {
        id: 'memberNoteRead',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.viewer,
          roles.entityEditor,
          roles.memberNoteEditor,
          roles.memberNoteViewer,
        ],
      },

      shipmentImport: {
        id: 'shipmentImport',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.shipmentEditor,
        ],
      },
      shipmentCreate: {
        id: 'shipmentCreate',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.shipmentEditor,
        ],
        allowedStorageFolders: ['shipment'],
      },
      shipmentEdit: {
        id: 'shipmentEdit',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.shipmentEditor,
        ],
        allowedStorageFolders: ['shipment'],
      },
      shipmentDestroy: {
        id: 'shipmentDestroy',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.shipmentEditor,
        ],
        allowedStorageFolders: ['shipment'],
      },
      shipmentShip: {
        id: 'shipmentShip',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.shipmentEditor,
        ],
        allowedStorageFolders: ['shipment'],
      },
      shipmentRead: {
        id: 'shipmentRead',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.viewer,
          roles.entityEditor,
          roles.shipmentEditor,
          roles.shipmentViewer,
        ],
      },
      shipmentAutocomplete: {
        id: 'shipmentAutocomplete',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.viewer,
          roles.entityEditor,
          roles.shipmentEditor,
          roles.shipmentViewer,
          roles.memberEditor,
          roles.memberViewer,
        ],
      },

      skuImport: {
        id: 'skuImport',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.skuEditor,
        ],
      },
      skuCreate: {
        id: 'skuCreate',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.skuEditor,
        ],
        allowedStorageFolders: ['sku'],
      },
      skuEdit: {
        id: 'skuEdit',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.skuEditor,
        ],
        allowedStorageFolders: ['sku'],
      },
      skuDestroy: {
        id: 'skuDestroy',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.skuEditor,
        ],
        allowedStorageFolders: ['sku'],
      },
      skuRead: {
        id: 'skuRead',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.viewer,
          roles.entityEditor,
          roles.skuEditor,
          roles.skuViewer,
        ],
      },
      skuAutocomplete: {
        id: 'skuAutocomplete',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.viewer,
          roles.entityEditor,
          roles.skuEditor,
          roles.skuViewer,
          roles.shipmentEditor,
          roles.shipmentViewer,
        ],
      },

      subscriptionPaymentImport: {
        id: 'subscriptionPaymentImport',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.subscriptionPaymentEditor,
        ],
      },
      subscriptionPaymentCreate: {
        id: 'subscriptionPaymentCreate',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.subscriptionPaymentEditor,
        ],
        allowedStorageFolders: ['subscriptionPayment'],
      },
      subscriptionPaymentEdit: {
        id: 'subscriptionPaymentEdit',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.subscriptionPaymentEditor,
        ],
        allowedStorageFolders: ['subscriptionPayment'],
      },
      subscriptionPaymentDestroy: {
        id: 'subscriptionPaymentDestroy',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.entityEditor,
          roles.subscriptionPaymentEditor,
        ],
        allowedStorageFolders: ['subscriptionPayment'],
      },
      subscriptionPaymentRead: {
        id: 'subscriptionPaymentRead',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.viewer,
          roles.entityEditor,
          roles.subscriptionPaymentEditor,
          roles.subscriptionPaymentViewer,
        ],
      },
      subscriptionPaymentAutocomplete: {
        id: 'subscriptionPaymentAutocomplete',
        allowedRoles: [
          roles.owner,
          roles.editor,
          roles.viewer,
          roles.entityEditor,
          roles.subscriptionPaymentEditor,
          roles.subscriptionPaymentViewer,
          roles.memberEditor,
          roles.memberViewer,
        ],
      },
    };
  }

  static get asArray() {
    return Object.keys(this.values).map((value) => {
      return this.values[value];
    });
  }
}

module.exports = Permissions;
