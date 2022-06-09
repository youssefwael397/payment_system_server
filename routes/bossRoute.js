const express = require("express");
const nodemailer = require("nodemailer");
let smtpTransport = require("nodemailer-smtp-transport");
const auth = require("../middleware/auth");
const boss = require("../middleware/boss");
const router = express.Router();
const { bossController } = require("../controllers/bossController");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".png");
  },
});
const upload = multer({ storage: storage });

// create
router.post("/create", upload.none(), async (req, res) => {
  try {
    const { create_boss, err } = await bossController.createNewBoss(req.body);
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(create_boss);
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
router.put("/update/", auth, boss, upload.none(), async (req, res) => {
  try {
    const token = req.body.token || req.headers.authorization;
    const { update_boss, err } = await bossController.updateBoss(
      req.body,
      token
    );
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(update_boss);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      error: "Internal Server Error",
    });
  }
});

router.put(
  "/resetpassword/:id",
  auth,
  boss,
  upload.none(),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { password } = req.body;
      const { err } = await bossController.resetPassword(id, password);
      console.log(id, password, err);

      if (err) {
        res.status(err.code).send({
          status: "error",
          error: err.text,
        });
      } else {
        res.send("تم تعديل كلمة المرور بنجاح");
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

// get boss by id as params
router.get("/", auth, boss, async (req, res) => {
  try {
    const token = req.body.token || req.headers.authorization;
    const { boss, err } = await bossController.getBossById(token);
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    }
    res.send(boss);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      error: "Internal Server Error",
    });
  }
});

// delete boss by id as params
router.delete("/", auth, boss, async (req, res) => {
  try {
    const token = req.body.token || req.headers.authorization;
    const { result, err } = await bossController.deleteBossById(token);
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    }
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      error: "Internal Server Error",
    });
  }
});

module.exports = router;
