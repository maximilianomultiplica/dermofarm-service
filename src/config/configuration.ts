export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DERMOFARM_DB_HOST || 'localhost',
    port: parseInt(process.env.DERMOFARM_DB_PORT || '5432', 10),
    username: process.env.DERMOFARM_DB_USER || 'postgres',
    password: process.env.DERMOFARM_DB_PASSWORD || 'password',
    database: process.env.DERMOFARM_DB_NAME || 'dermofarm',
  },
  agent: {
    apiUrl: process.env.AGENT_API_URL || 'http://localhost:8000',
    apiKey: process.env.AGENT_API_KEY || 'default-api-key',
  },
  nodeEnv: process.env.NODE_ENV || "development",
});
