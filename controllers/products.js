import Product from "../models/products.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

/* Fetch All Products - GET - /api/v1/products */
const fetchProducts = asyncHandler ( async (req, res) => {

        const page = parseInt(req.params.page);  // page=1
        const perPage = parseInt(req.params.perPage);   // 10
  
        const products = await Product.find({});

        if (page && perPage) {
          const totalPages = Math.ceil(products.length / perPage);
                                        ///  12/10 = 2
          const startIndex = (page - 1) * perPage;
          const endIndex = startIndex + perPage;
          const paginatedProducts = products.slice(startIndex, endIndex);      
          res.json({
            products: paginatedProducts,
            pagination: {
              currentPage: page,
              totalPages,
              perPage,
              startIndex,
              endIndex
            },
          });
        } else {
          res.json({
            products,
            pagination: {},
          });
        }
         
});

/* Fetch Single Productby id - GET - /api/v1/product/:pid */
// const fetchProduct = async (req, res) => {
//     const id = req.params.id;
//     const product = await Product.findById(req.params.id);

//     if(product){
//         res.json( product );
//     }
//     else {
//         res.status(404).send('Product not found.');
// 		throw new Error('Product not found');
//     }
// };
const fetchProduct = async (req, res) => {
  const id = req.params.id;

  // Log the received ID
  console.log("Received product ID:", id);

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
      const product = await Product.findById(id);
      if (product) {
          res.json(product);
      } else {
          res.status(404).send('Product not found.');
      }
  } catch (error) {
      res.status(500).json({ message:"Server error", error: error.message });
  }
};



/* Add New Product - POST - /api/v1/product/ (Logged in as Admin) */
const addProduct = asyncHandler (async (req, res) => {
  try {
    // const UserId = req.params.userId
    const { title,images, subTitle, brand, category, description, price, stock, rating, numOfReviews } = req.body;
    if(!title){
      return res.status(400).json({success:false,message: 'All fields are required'})
  
    }
    const creatProduct= new Product({
      title,
      subTitle,
      brand,
      category,
      description,
      price,
      stock,
      rating,
      numOfReviews,
      images,
    
    })
    await creatProduct.save()
    res.status(201).json({success:true, message: 'Product created successfully',product:creatProduct})
    
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false, message: 'Server Error'})
    
  }
  });

/* Update Product by id - PUT - /api/v1/product/ (Admin)  */

  const updateProduct = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, images, price } = req.body;
  
      // Find the product by ID
      const findProduct = await Product.findById(id);
      if (!findProduct) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
  
      // Update product details
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { title, description, images, price },
        { new: true }
      );
  
      return res.status(200).json({ success: true, message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  });
  
/* Delete Product by id - DELETE - /api/v1/product/ (Admin)  */
const deleteProduct = asyncHandler (async (req, res) => {
  try {
    const PostId = req.params.id;
    console.log('PostId:', PostId);  // Log the ID
    const FindProduct = await Product.findById({_id: PostId});
    
    if (!FindProduct) {
      return res.status(404).json({success: false, message: 'Product not found'});
    }

    console.log('Product Found:', FindProduct);  // Log the found product
    const deletedProduct = await Product.findByIdAndDelete({
      _id: PostId
    });

    console.log('Deleted Product:', deletedProduct);  // Log the deleted product

    return res.status(200).json({success: true, message: 'Product deleted successfully', product: deletedProduct});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Server Error'});
  }
});

export  {
    fetchProducts,
    fetchProduct,
    addProduct,
    updateProduct,
    deleteProduct
}