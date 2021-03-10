const { i18n } = require('../i18n');

module.exports = class ErrorEmail {
  constructor(language, to, message) {
    this.language = language;
    this.to = to;
    this.message = message;
  }

  get subject() {
    return 'An error occurred';
  }

  get html() {
    return this.message;
  }
};
