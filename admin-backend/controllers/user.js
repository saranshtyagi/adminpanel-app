const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getUsers(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const users = await prisma.user.findMany({
    skip: +skip,
    take: +limit,
  });

  res.json(users);
}

module.exports = { getUsers };
