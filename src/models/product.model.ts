import mongoose, { Schema, models } from "mongoose";

export interface IProduct extends mongoose.Document {
  name: string;
  brand: string;
  description: string;
  price: number;
  discountPrice?: number;
  gender: "male" | "female" | "unisex";
  category: string;
  sizes: {
    size: string;
    stock: number;
  }[];
  images: string[];
  featured: boolean;
  isNew: boolean;
  rating: number;
  reviews: {
    userId: mongoose.Types.ObjectId;
    userName: string;
    rating: number;
    comment: string;
    date: Date;
  }[];
  tags: string[];
  ingredients: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female", "unisex"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    sizes: [
      {
        size: String,
        stock: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
    images: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        userName: String,
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [String],
    ingredients: [String],
  },
  {
    timestamps: true,
  }
);

// Create indexes for common search operations
ProductSchema.index({ name: "text", brand: "text", description: "text" });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ gender: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ isNew: 1 });

// Check if the model already exists before creating a new one (for Next.js hot reloading)
export default models.Product || mongoose.model<IProduct>("Product", ProductSchema);