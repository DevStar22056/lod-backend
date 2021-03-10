module.exports = {
  env: 'production',

  database: {
    username: process.env.DB_USERNAME,
    dialect: 'mysql',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    logging: console.log,
    operatorsAliases: false,
    migrationHost: process.env.DB_HOST,
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

  graphiql: false,

  clientUrl: 'https://lodadmin2.web.app/',

  defaultUser: null,

  uploadDir: '/storage',

  authJwtSecret: process.env.JWT_SECRET,
};
