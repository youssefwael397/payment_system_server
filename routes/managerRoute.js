const express = require("express");
const fs = require("fs");
const nodemailer = require("nodemailer");
let smtpTransport = require("nodemailer-smtp-transport");
const router = express.Router();
const { managerController } = require("../controllers/managerController");
const auth = require("../middleware/auth");
const boss = require("../middleware/boss");
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

// create new manager by form data
router.post("/create", auth, boss, upload.any(), async (req, res) => {
  try {
    const images = req.files;
    const { new_manager, err } = await managerController.createNewManager(
      req.body,
      images
    );
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(new_manager);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// update manager by form data
router.put("/update/:id", auth, boss, upload.none(), async (req, res) => {
  try {
    const { id } = req.params;
    const { update_manager, err } = await managerController.updateManager(
      id,
      req.body
    );
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(update_manager);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      error: "Internal Server Error",
    });
  }
});

// update manager image by form data
router.put(
  "/update/image/:id",
  auth,
  boss,
  upload.single("manager_img"),
  async (req, res) => {
    const { id } = req.params;
    const manager_img = req.file;
    try {
      const { success, err } = await managerController.updateManagerImage(
        id,
        manager_img
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
      console.log(error);
      res.status(500).send({
        status: "error",
        error: "Internal Server Error",
      });
    }
  }
);

// update manager national id images by form data
router.put(
  "/update/national-images/:id",
  auth,
  boss,
  upload.any(),
  async (req, res) => {
    try {
      const { id } = req.params;
      const images = req.files;
      const { success, err } =
        await managerController.updateManagerNationalImages(id, images);

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

// get all managers
router.get("/", auth, boss, async (req, res) => {
  try {
    const { managers } = await managerController.getAllManagers();
    res.send(managers);
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// get manager by id
router.get("/:id", auth, boss, async (req, res) => {
  const { id } = req.params;
  try {
    const { manager, err } = await managerController.getManagerById(id);
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(manager);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// delete manager by id
router.delete("/:id", auth, boss, async (req, res) => {
  try {
    const { id } = req.params;
    const { result, err } = await managerController.deleteManagerById(id);
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
