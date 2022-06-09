const express = require("express");
const fs = require("fs");
const nodemailer = require("nodemailer");
const auth = require("../middleware/auth");
const manager = require("../middleware/manager");
let smtpTransport = require("nodemailer-smtp-transport");
const router = express.Router();
const { salesController } = require("../controllers/salesController");
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

// create new sales by form data
router.post("/create", auth, manager, upload.any(), async (req, res) => {
  try {
    const { new_sales, err } = await salesController.createNewSales(
      req.body,
      req.files
    );
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(new_sales);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// update sales by form data
router.put("/update/:id", auth, manager, upload.none(), async (req, res) => {
  const { id } = req.params;
  try {
    const { update_sales, err } = await salesController.updateSales(
      id,
      req.body
    );
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(update_sales);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// update sales image by form data
router.put(
  "/update/image/:id",
  auth,
  manager,
  upload.single("sales_img"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const sales_img = req.file;
      const { success, err } = await salesController.updateSalesImage(
        id,
        sales_img
      );
      
      if (err) {
        res.status(err.code).send({
          status: "error",
          error: err.text,
        });
      } else {
        res.send(success);
      }
    } catch (error) {
      res.status(500).send({
        status: "error",
        error,
      });
    }
  }
);

// update sales national id images by form data
router.put("/update/national-images/:id",auth, manager, upload.any(), async (req, res) => {
  const { id } = req.params;
  const images = req.files;
  try {
    const { success, err } = await salesController.updateSalesNationalImages(
      id,
      images
    );
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(success);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// get all sales
router.get("/", auth, manager, async (req, res) => {
  try {
    const { sales } = await salesController.getAllSales();
    res.send(sales);
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// get all sales by branch id
router.get("/branch/:id", auth, manager, async (req, res) => {
  try {
    const { id } = req.params;
    const { sales, err } = await salesController.getAllSalesByBranchId(id);
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(sales);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// get sales by id
router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const { sales, err } = await salesController.getSalesById(id);
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(sales);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// delete sales by id
router.delete("/:id",auth,manager, async (req, res) => {
  try {
    const { id } = req.params;
    const { result, err } = await salesController.deleteSalesById(id);
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
