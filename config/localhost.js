const os = require('os');

module.exports = {
  env: 'localhost',

  database: {
    username: process.env.DB_USERNAME,
    dialect: 'mysql',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    logging: false,
    operatorsAliases: false,
  },

  email: {
    comment: 'See https://nodemailer.com',
    from: 'lukechambers7@gmail.com',
    host: process.env.SMTP_HOST,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  },

  graphiql: true,

  clientUrl: 'http://localhost:8081',

  defaultUser: '<insert your email here>',

  uploadDir: os.tmpdir(),

  authJwtSecret: 'sweet',
};
