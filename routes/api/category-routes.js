const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  const categories = await Category.findAll();
  return res.json(categories);
  // find all categories
  // be sure to include its associated Products
});

router.get('/:id', async (req, res) => {
  const categories = await Category.findOne(
    {
      where: {
        id: req.params.id
      },
    });
    res.json(categories);
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', async (req, res) => {
  // create a new category
  try {
  const categoriesData = await Category.create({
    category_name: req.body.category_name,
  });
  res.json(categoriesData);
} catch (err) {
  console.error(err);
  if (err.name === 'SequelizeValidationError') {
    res.status(400).json({ error: 'Validation error', details: err.errors });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
}
});


router.put('/:id', async (req, res) => {
try {
  const result = await Category.update(
    {
      ...req.body
    },
    {
      where: {
        id: req.params.id,
      }
    });
    console.log(result);
    res.json({msg: "Category Updated"});
} catch(e) {
  console.error(e);
  res.status(500).json(e);
}  // update a category by its `id` value
});


router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const results = await Category.destroy(
      {
        where: {
          id: req.params.id,
        }
      });
      console.log(results);
      res.json({msg: "Deleted successfully"});
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

module.exports = router;
