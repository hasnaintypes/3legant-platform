import Product from "../models/productModel.js";
import { ErrorResponse, sendErrorResponse } from "../utils/errorResponse.js";
import { sendSuccessResponse } from "../utils/successResponse.js";

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPercentage,
      images,
      colors,
      sizes,
      stock,
      SKU,
      brand,
      category,
      badge,
      isFeatured,
      warranty,
      returnPolicy,
    } = req.body;

    // Calculate final price based on discount
    const finalPrice = price - (price * (discountPercentage || 0)) / 100;

    // Create new product
    const product = await Product.create({
      name,
      description,
      price,
      discountPercentage: discountPercentage || 0,
      finalPrice,
      images,
      colors,
      sizes,
      stock,
      SKU,
      brand,
      category,
      badge,
      isFeatured: isFeatured || false,
      warranty,
      returnPolicy,
    });

    return sendSuccessResponse(
      res,
      { product },
      "Product created successfully",
      201
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = "-createdAt",
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      featured,
      onSale,
      search,
    } = req.query;

    // Build filter object
    const filter = {};

    // Category filter
    if (category) {
      filter.category = { $in: category.split(",") };
    }

    // Brand filter
    if (brand) {
      filter.brand = { $in: brand.split(",") };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.finalPrice = {};
      if (minPrice) filter.finalPrice.$gte = Number(minPrice);
      if (maxPrice) filter.finalPrice.$lte = Number(maxPrice);
    }

    // In stock filter
    if (inStock === "true") {
      filter.stock = { $gt: 0 };
    }

    // Featured products filter
    if (featured === "true") {
      filter.isFeatured = true;
    }

    // On sale filter (products with discount)
    if (onSale === "true") {
      filter.discountPercentage = { $gt: 0 };
    }

    // Search by name, description, or SKU
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { SKU: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // Count total products matching the filter
    const total = await Product.countDocuments(filter);

    // Calculate pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = Number(page) * Number(limit);
    const totalPages = Math.ceil(total / Number(limit));

    // Get products with pagination and sorting
    const products = await Product.find(filter)
      .sort(sort)
      .skip(startIndex)
      .limit(Number(limit));

    // Pagination result
    const pagination = {
      currentPage: Number(page),
      totalPages,
      totalProducts: total,
      hasNextPage: endIndex < total,
      hasPrevPage: startIndex > 0,
    };

    return sendSuccessResponse(
      res,
      { products, pagination },
      "Products fetched successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new ErrorResponse("Product not found", 404);
    }

    return sendSuccessResponse(
      res,
      { product },
      "Product fetched successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPercentage,
      images,
      colors,
      sizes,
      stock,
      SKU,
      brand,
      category,
      badge,
      isFeatured,
      warranty,
      returnPolicy,
    } = req.body;

    // Find product by ID
    let product = await Product.findById(req.params.id);

    if (!product) {
      throw new ErrorResponse("Product not found", 404);
    }

    // Calculate final price if price or discount changed
    let finalPrice = product.finalPrice;
    if (price || discountPercentage !== undefined) {
      const newPrice = price || product.price;
      const newDiscount =
        discountPercentage !== undefined
          ? discountPercentage
          : product.discountPercentage;
      finalPrice = newPrice - (newPrice * newDiscount) / 100;
    }

    // Update product fields
    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        discountPercentage:
          discountPercentage !== undefined
            ? discountPercentage
            : product.discountPercentage,
        finalPrice,
        images: images || product.images,
        colors: colors || product.colors,
        sizes: sizes || product.sizes,
        stock: stock !== undefined ? stock : product.stock,
        SKU: SKU || product.SKU,
        brand: brand || product.brand,
        category: category || product.category,
        badge: badge || product.badge,
        isFeatured: isFeatured !== undefined ? isFeatured : product.isFeatured,
        warranty: warranty || product.warranty,
        returnPolicy: returnPolicy || product.returnPolicy,
      },
      { new: true, runValidators: true }
    );

    return sendSuccessResponse(
      res,
      { product },
      "Product updated successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new ErrorResponse("Product not found", 404);
    }

    await Product.findByIdAndDelete(req.params.id);

    return sendSuccessResponse(res, null, "Product deleted successfully");
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;

    const featuredProducts = await Product.find({ isFeatured: true })
      .sort("-createdAt")
      .limit(limit);

    return sendSuccessResponse(
      res,
      { products: featuredProducts },
      "Featured products fetched successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Get products on sale (with discount)
 * @route   GET /api/products/sale
 * @access  Public
 */
export const getProductsOnSale = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;

    const saleProducts = await Product.find({ discountPercentage: { $gt: 0 } })
      .sort("-discountPercentage")
      .limit(limit);

    return sendSuccessResponse(
      res,
      { products: saleProducts },
      "Sale products fetched successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Get product categories
 * @route   GET /api/products/categories
 * @access  Public
 */
export const getProductCategories = async (req, res) => {
  try {
    // Get unique categories from all products
    const categories = await Product.distinct("category");

    // Flatten the array since category is an array in the schema
    const flattenedCategories = [...new Set(categories.flat())];

    return sendSuccessResponse(
      res,
      { categories: flattenedCategories },
      "Product categories fetched successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

/**
 * @desc    Get product brands
 * @route   GET /api/products/brands
 * @access  Public
 */
export const getProductBrands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand");

    return sendSuccessResponse(
      res,
      { brands },
      "Product brands fetched successfully"
    );
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
