import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/mongodb";
import ProductModel from "@/models/product.model";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET - Fetch a single product by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid product ID format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const product = await ProductModel.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error fetching product:", error.message);
    return NextResponse.json(
      { message: "Error fetching product" },
      { status: 500 }
    );
  }
}

// PUT - Update a product (Admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const id = params.id;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid product ID format" },
        { status: 400 }
      );
    }

    const updateData = await req.json();
    await connectToDatabase();

    // Check if product exists
    const existingProduct = await ProductModel.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Update the product
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("Error updating product:", error.message);
    return NextResponse.json(
      { message: "Error updating product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a product (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const id = params.id;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid product ID format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if product exists
    const existingProduct = await ProductModel.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Delete the product
    await ProductModel.findByIdAndDelete(id);

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting product:", error.message);
    return NextResponse.json(
      { message: "Error deleting product" },
      { status: 500 }
    );
  }
}