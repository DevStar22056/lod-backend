class Roles {
  static get values() {
    return {
      owner: 'owner',
      editor: 'editor',
      viewer: 'viewer',
      auditLogViewer: 'auditLogViewer',
      iamSecurityReviewer: 'iamSecurityReviewer',
      entityEditor: 'entityEditor',
      entityViewer: 'entityViewer',
      memberEditor: 'memberEditor',
      memberViewer: 'memberViewer',
      memberNoteEditor: 'memberNoteEditor',
      memberNoteViewer: 'memberNoteViewer',
      shipmentEditor: 'shipmentEditor',
      shipmentViewer: 'shipmentViewer',
      skuEditor: 'skuEditor',
      skuViewer: 'skuViewer',
      subscriptionPaymentEditor: 'subscriptionPaymentEditor',
      subscriptionPaymentViewer: 'subscriptionPaymentViewer',
    };
  }
}

module.exports = Roles;
