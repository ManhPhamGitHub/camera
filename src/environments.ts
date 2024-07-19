import * as dotenv from 'dotenv';
import * as convict from 'convict';

dotenv.config();

export const env = convict({
  environment: {
    format: String,
    default: 'development',
    env: 'NODE_ENV',
    doc: 'Is Production',
  },
  port: {
    format: Number,
    default: 8000,
    env: 'PORT',
    doc: 'Port of server',
  },
  logColor: {
    format: String,
    default: '#6d20ab',
    env: 'LOG_PRIMARY_COLOR',
    doc: 'Color of log request',
  },
  rateLimit: {
    format: Number,
    default: 1000,
    env: 'RATE_LIMIT_MAX',
    doc: 'Rate limit request / IP',
  },
  jwt: {
    secret: {
      format: String,
      default: 'thisisprivatekey',
      env: 'JWT_SECRET_KEY',
      doc: 'Jwt secret key',
    },
    expirationTime: {
      format: String,
      default: '2d',
      env: 'JWT_EXPIRATION_TIME',
    },
  },
  mysql: {
    host: {
      format: String,
      default: 'mysql',
      env: 'MYSQL_HOST',
      doc: 'Mysql host',
    },
    port: {
      format: Number,
      default: 3306,
      env: 'MYSQL_PORT',
      doc: 'Mysql port',
    },
    username: {
      format: String,
      default: 'root',
      env: 'MYSQL_USERNAME',
      doc: 'Mysql username',
    },
    password: {
      format: String,
      default: 'root',
      env: 'MYSQL_PASSWORD',
      doc: 'Mysql password',
    },
    database: {
      format: String,
      default: 'camera',
      env: 'MYSQL_DATABASE',
      doc: 'Mysql database',
    },
    isLogging: {
      format: Boolean,
      default: true,
      env: 'MYSQL_QUERY_LOGGING',
      doc: 'For debug mysql query',
    },
  },
  postgres: {
    host: {
      format: String,
      default: '',
      env: 'POSTGRES_HOST',
      doc: 'Postgresql host',
    },
    port: {
      format: Number,
      default: 5432,
      env: 'POSTGRES_PORT',
      doc: 'Mysql port',
    },
    username: {
      format: String,
      default: '',
      env: 'POSTGRES_USERNAME',
      doc: 'Postgresql username',
    },
    password: {
      format: String,
      default: '',
      env: 'POSTGRES_PASSWORD',
      doc: 'Postgresql password',
    },
    database: {
      format: String,
      default: 'cloudops_authentication_partner',
      env: 'POSTGRES_DATABASE',
      doc: 'Postgresql database',
    },
    isLogging: {
      format: Boolean,
      default: true,
      env: 'POSTGRES_QUERY_LOGGING',
      doc: 'For debug postgresql query',
    },
  },
  swagger: {
    serverBaseUrl: {
      format: String,
      default: 'http://localhost:8000/',
      env: 'SWAGGER_BASE_URL',
    },
  },
  mail: {
    host: {
      format: String,
      default: 'smtp.sendgrid.net',
      env: 'MAIL_HOST_SERVER',
    },
    port: {
      format: Number,
      default: 587,
      env: 'MAIL_HOST_PORT',
    },
    from: {
      format: String,
      default: '',
      env: 'FROM_MAIL_SENDER',
    },
    to: {
      format: String,
      default: 'devops@cmctelecom.vn',
      env: 'TO_MAIL_SENDER',
    },
    author: {
      format: String,
      default: 'CMC Cloud',
      env: 'EMAIL_AUTHOR',
    },
    nodemailerUser: {
      format: String,
      default: 'apikey',
      env: 'NODEMAILER_USER',
      doc: 'Type of user mail service',
    },
    nodemailerPass: {
      format: String,
      default: '',
      env: 'NODEMAILER_PASS',
      doc: 'Api key mail',
    },
  },
  project: {
    timeExpireInvite: {
      format: Number,
      default: 2,
      env: 'PROJECT_EXPIRE_TIME_INVITE',
      doc: 'Time expire project invite (hour)',
    },
  },
  frontend: {
    baseUrl: {
      format: String,
      default: 'http://localhost:3000',
      env: 'FRONTEND_BASE_URL',
    },
  },
  encryptKey: {
    format: String,
    default: 'test',
    env: 'ENCRYPT_KEY',
  },
  github_client_secret: {
    format: String,
    default: 'test',
    env: 'GITHUB_SECRET_KEY',
  },
  gitlab_client_secret: {
    format: String,
    default: 'test',
    env: 'GITLAB_SECRET_KEY',
  },
});

export default env;
