const db = config.get('mongoURI');

export default {
  env: 'test',
  db: db,
  port: 3000,
  jwtSecret: 'my-api-secret',
  jwtDuration: '2 hours'
};
