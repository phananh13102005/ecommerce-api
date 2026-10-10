import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../services/product.service.js";

export async function getProducts(req, res) {
  try {
    const products = await getAllProducts();

    return res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Cannot get products"
    });
  }
}

export async function getProduct(req, res) {
  try {
    const pid = Number(req.params.pid);

    if (!Number.isInteger(pid) || pid <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id"
      });
    }

    const product = await getProductById(pid);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Cannot get product"
    });
  }
}

export async function addProduct(req, res) {
  try {
    const {
      name,
      description,
      price,
      quantity
    } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "name, description, price and quantity are required"
      });
    }

    const numericPrice = Number(price);
    const numericQuantity = Number(quantity);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "price must be a non-negative number"
      });
    }

    if (!Number.isInteger(numericQuantity) || numericQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "quantity must be a non-negative integer"
      });
    }

    const product = await createProduct({
      name,
      price: numericPrice,
      quantity: numericQuantity
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Cannot create product"
    });
  }
}

export async function editProduct(req, res) {
  try {
    const pid = Number(req.params.pid);

    if (!Number.isInteger(pid) || pid <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id"
      });
    }

    const currentProduct = await getProductById(pid);

    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const {
      name,
      price,
      quantity
    } = req.body;

    if (
      !name||
      price === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "name, description, price and quantity are required"
      });
    }

    const numericPrice = Number(price);
    const numericQuantity = Number(quantity);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "price must be a non-negative number"
      });
    }

    if (!Number.isInteger(numericQuantity) || numericQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "quantity must be a non-negative integer"
      });
    }

    const product = await updateProduct(pid, {
      name,
      price: numericPrice,
      quantity: numericQuantity
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Cannot update product"
    });
  }
}

export async function removeProduct(req, res) {
  try {
    const pid = Number(req.params.pid);

    if (!Number.isInteger(pid) || pid <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id"
      });
    }

    const currentProduct = await getProductById(pid);

    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    await deleteProduct(pid);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Cannot delete product"
    });
  }
}