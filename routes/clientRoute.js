const express = require("express");
const auth = require("../middleware/auth");
const sales = require("../middleware/sales");
const manager = require("../middleware/manager");
const fs = require("fs");
const nodemailer = require("nodemailer");
let smtpTransport = require("nodemailer-smtp-transport");
const router = express.Router();
const { clientController } = require("../controllers/clientController");
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

// create new client by form data
router.post("/create", auth, sales, upload.any(), async (req, res) => {
  const images = req.files;
  try {
    const { new_client, err } = await clientController.createNewClient(
      req.body,
      images
    );
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(new_client);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// update client by form data
router.put(
  "/update/:client_id",
  auth,
  manager,
  upload.none(),
  async (req, res) => {
    const { client_id } = req.params;
    try {
      const { update_client, err } = await clientController.updateClient(
        client_id,
        req.body
      );
      if (err) {
        res.status(err.code).send({
          status: "error",
          error: err.text,
        });
      } else {
        res.send(update_client);
      }
    } catch (error) {
      res.status(500).send({
        status: "error",
        error,
      });
    }
  }
);

// update client national id images by form data
router.put(
  "/update/national-images/:id",
  auth,
  manager,
  upload.any(),
  async (req, res) => {
    const { id } = req.params;
    const images = req.files;
    try {
      const { success, err } =
        await clientController.updateClientNationalImages(id, images);
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

// block & unblock client by id
router.put("/block/:id",auth, async (req, res) => {
  const { id } = req.params;
  try {
    const { client, err } = await clientController.blockClientById(id);
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(client);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});


// get all client
router.get("/",auth, async (req, res) => {
  try {
    const { clients } = await clientController.getAllClients();
    res.send(clients);
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// get client by id
router.get("/:id",auth, async (req, res) => {
  const { id } = req.params;
  try {
    const { client, err } = await clientController.getClientById(id);
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(client);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// get clients by sales id
router.get("/sales/:id",auth, async (req, res) => {
  const { id } = req.params;
  try {
    const { clients, err } = await clientController.getClientsBySalesId(id);
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(clients);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});


router.get("/branch/:id",auth, async (req, res) => {
  const { id } = req.params;
  try {
    const { clients, err } = await clientController.getClientsByBranchId(id);
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
      res.send(clients);
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// delete client by id
router.delete("/:id", async (req, res) => {
  try {
    const token = req.body.token || req.headers.authorization;
    const { id } = req.params;
    const { result, err } = await clientController.deleteclientById(id, token);
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
