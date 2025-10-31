const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getCategories(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const categories = await prisma?.categories.findMany({
    include: { products: true },
    skip: +skip,
    take: +limit,
  });
  res.json(categories);
}

async function getProductByCategory(req, res) {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const products = await prisma.findMany({
    where: { categoryId: id },
    skip: +skip,
    take: +limit,
  });
  res.json(products);
}

async function createCategory(req, res) {
  const { name, imageUrl } = req.body;
  const category = await prisma.category.update({
    where: { id },
    data: { name, imageUrl },
  });
  res.json(category);
}


async function updateCategory(req, res) {
    const { id } = req.params; 
    const { name, imageUrl } = req.body; 
    const category = await prisma.category.update({
        where: { id }, 
        data: { name, imageUrl },
    });
    res.json(category);
}

async function deleteCategory(req, res) {
    const { id } = req.params; 
    await prisma.product.deleteMany({ where: { categoryId: id }}); 
    await prisma.category.delete({ where: { id }}); 
    res.json({ message: "Category and its products deleted "});
}

module.exports = { getCategories, getProductByCategory, createCategory, updateCategory, deleteCategory };