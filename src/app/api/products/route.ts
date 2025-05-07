import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/mongodb";
import ProductModel from "@/models/product.model";
import { getServerSession } from "next-auth";

// GET - Fetch all products with optional filtering
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    
    // Extract query parameters for filtering
    const gender = url.searchParams.get("gender");
    const category = url.searchParams.get("category");
    const brand = url.searchParams.get("brand");
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    const searchQuery = url.searchParams.get("search");
    const featured = url.searchParams.get("featured");
    const isNew = url.searchParams.get("isNew");
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "12");
    
    // Connect to database
    await connectToDatabase();

    // Build filter object
    const filter: any = {};
    
    if (gender) filter.gender = gender;
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (featured === "true") filter.featured = true;
    if (isNew === "true") filter.isNew = true;
    
    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Text search
    if (searchQuery) {
      filter.$text = { $search: searchQuery };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalProducts = await ProductModel.countDocuments(filter);

    // Sort options
    const sort: any = {};
    if (sortBy === "price") {
      sort.price = sortOrder === "asc" ? 1 : -1;
    } else if (sortBy === "name") {
      sort.name = sortOrder === "asc" ? 1 : -1;
    } else if (sortBy === "rating") {
      sort.rating = sortOrder === "asc" ? 1 : -1;
    } else {
      sort.createdAt = sortOrder === "asc" ? 1 : -1;
    }

    // Fetch products
    const products = await ProductModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get unique brands and categories for filters
    const brands = await ProductModel.distinct("brand");
    const categories = await ProductModel.distinct("category");

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts
      },
      filters: {
        brands,
        categories
      }
    });
  } catch (error: any) {
    console.error("Error fetching products:", error.message);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}

// POST - Create a new product (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const productData = await req.json();
    
    // Validate required fields
    const requiredFields = ["name", "brand", "description", "price", "gender", "category", "sizes"];
    const missingFields = requiredFields.filter(field => !productData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Create the product
    const newProduct = await ProductModel.create(productData);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error.message);
    return NextResponse.json(
      { message: "Error creating product" },
      { status: 500 }
    );
  }
}