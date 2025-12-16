/** @type {import("prisma/config").PrismaConfig} */
module.exports = {
  datasource: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};
