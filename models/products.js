import mongoose from "mongoose";

const { model, Schema, ObjectId } = mongoose;

const productSchema = new Schema(
  {
    title: {
      type: String,
     
      maxLength: "200",
      trim: true,
    },
    subTitle: {
      type: String,
     
      maxLength: "200",
      trim: true,
    },
    brand: {
      type: String,
 
      trim: true,
    },
    category: {
        type: String,
      
        trim: true,
    },
    description: {
      type: String,
     
     
    },
    price: {
        type: Number,
       
    },
    salePrice: {
        type: Number,
        default: 0
    },
    discount: {
        type: String,
        default: ""
    },
    stock: {
        type: Number,
     
        default: 0
    },
    rating: {
        type: Number,
      
        default: 5
    },
    numOfReviews: {
        type: Number,
       
        default: 0
    },
    reviews: [],
    images: [{}],
    colors: [],
    sizes:[],
    sold: {type: Boolean, default: false},
    productIsNew: {type: Boolean, default: false},
    onSale: {type: Boolean, default: false},
    slug: {
        type: String,
        lowercase: true,
        unique: true,
        default: ""
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    stripeId: {
        type: String
    }
  },  { timestamps: true }
);

const Product = model("product", productSchema);

export default Product;
