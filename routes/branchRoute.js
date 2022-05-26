const express = require("express");
const auth = require("../middleware/auth");
const boss = require("../middleware/boss");
const fs = require("fs");
const nodemailer = require("nodemailer");
let smtpTransport = require("nodemailer-smtp-transport");
const router = express.Router();
const { branchController } = require("../controllers/branchController");
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

// create
router.post("/create", auth, boss, upload.single("logo"), async (req, res) => {
  try {
    const logo = req.file;
    const { create_branch, err } = await branchController.createNewBranch(
      req.body,
      logo
    );
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(create_branch);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      error: "Internal Server Error",
    });
  }
});

// update
router.put("/update/:id", auth, boss, upload.none(), async (req, res) => {
  const { id } = req.params;
  try {
    const { update_branch, err } = await branchController.updateBranch(
      id,
      req.body
    );
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(update_branch);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      error: "Internal Server Error",
    });
  }
});

// update logo image
router.put(
  "/update/image/:id",
  auth,
  boss,
  upload.single("logo"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const logo = req.file;
      const { success, err } = await branchController.updateLogoImage(id, logo);
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

// get all
router.get("/", auth, async (req, res) => {
  try {
    const branches = await branchController.getAllBranches();
    res.send(branches);
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// get by id
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { branch, err } = await branchController.getBranchById(id);
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(branch);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// delete branch by id
router.delete("/:id", auth, boss, async (req, res) => {
  try {
    const { id } = req.params;
    const { result, err } = await branchController.deleteBranchById(id);
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
