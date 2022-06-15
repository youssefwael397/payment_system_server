const express = require("express");
const fs = require("fs");
const nodemailer = require("nodemailer");
const auth = require("../middleware/auth");
const manager = require("../middleware/manager");
let smtpTransport = require("nodemailer-smtp-transport");
const router = express.Router();
const { productController } = require("../controllers/productController");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "./img",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".png");
  },
});
const upload = multer({ storage: storage });

// create new Product by form data
router.post("/create", auth, manager, upload.none(), async (req, res) => {
  try {
    const { new_Product, err } = await productController.createNewProduct(
      req.body
    );
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(new_Product);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// update Product by form data
router.put(
  "/update/:product_id",
  auth,
  manager,
  upload.none(),
  async (req, res) => {
    try {
      const { product_id } = req.params;
      const { updateProduct, err } = await productController.updateProduct(
        product_id,
        req.body
      );
      if (err) {
        res.status(err.code).send({
          status: "error",
          error: err.text,
        });
      } else {
        res.send(updateProduct);
      }
    } catch (error) {
      res.status(500).send({
        status: "error",
        error,
      });
    }
  }
);

// get all categories by branch id
router.get("/branch/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const { products, err } = await productController.getAllProductsByBranchId(
      id
    );
    if (err) {
      res.status(err.code).send({ status: "error", error: err.text });
    } else {
      res.send(products);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// get Product by id
router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const { product, err } = await productController.getProductById(id);
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(product);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// delete Product by id
router.delete("/:id", auth, manager, async (req, res) => {
  const token = req.body.token || req.headers.authorization;
  const { id } = req.params;
  try {
    const { result, err } = await productController.deleteProductById(
      id,
      token
    );
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

module.exports = router;
