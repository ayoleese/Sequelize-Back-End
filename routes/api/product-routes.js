const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  const products = await Product.findAll({
    include: [
      {
        model: Category,
      },
      {
        model: Tag,
      },
    ]
  });
  return res.json(products);
  // find all products
  // be sure to include its associated Category and Tag data
});

// get one product
router.get('/:id', async (req, res) => {
    // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  const products = await Product.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Category,
      },
      {
        model: Tag,
      },
    ]
  });
  return res.json(products);
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
   {
     product_name: "Basketball",
     price: 200.00,
     stock: 3,
     tagIds: [1, 2, 3, 4]
   }
 */

  try {
    // Create the product
    const productData = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
    });

    // If tagIds are provided, associate tags with the product
    if (req.body.tagIds && req.body.tagIds.length) {
      const tags = await Tag.findAll({
        where: {
          id: req.body.tagIds,
        },
      });

      // Associate tags with the product
      await productData.addTags(tags);
    }

    // Send the response with the created product data
    res.json(productData);
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json(err);
  }
});


// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json({msg: " Updated"});
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
    // delete one product by its `id` value
  try {
    const productResult = await Product.destroy(
      {
        where: {
          id: req.params.id,
        }
      });
      console.log(productResult);
      res.json({msg: "Deleted successfully"})
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
