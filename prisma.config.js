module.exports = {
  datasource: {
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
  },
  generator: {
    provider: 'prisma-client-js',
    binaryTargets: ['native', 'rhel-openssl-1.0.x']
  }
};
