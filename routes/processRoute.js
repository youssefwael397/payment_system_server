const express = require("express");
const fs = require("fs");
const auth = require("../middleware/auth");
const sales = require("../middleware/sales");
const manager = require("../middleware/manager");
let smtpTransport = require("nodemailer-smtp-transport");
const router = express.Router();
const { processController } = require("../controllers/processController");
const {
  processMonthController,
} = require("../controllers/processMonthController");

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
router.post("/create", auth, sales, upload.none(), async (req, res) => {
  try {
    const { new_process, err } = await processController.createNewProcess(
      req.body
    );
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    } else {
    }
    res.send(new_process);
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// get all processes by client id
router.get("/client/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const { processes } = await processController.getAllProcessesByClientId(id);
    res.send(processes);
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// get all processes months by sales id
router.get("/month/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const { processes, err } =
      await processMonthController.getAllProcessesMonthByProcessId(id);
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    }
    res.send(processes);
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// get all processes by sales id
router.get("/sales/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const { processes, err } = await processController.getAllProcessesBySalesId(
      id
    );
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    }
    res.send(processes);
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// get process id
router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const { process, err } = await processController.getProcessById(id);
    if (err) {
      res.status(err.code).send({
        status: "error",
        error: err.text,
      });
    }
    res.send(process);
  } catch (error) {
    res.status(500).send({
      status: "error",
      error,
    });
  }
});

// update client by form data
router.put(
  "/update/:process_month_id",
  auth,
  manager,
  upload.none(),
  async (req, res) => {
    const { process_month_id } = req.params;
    try {
      const { process, err } = await processMonthController.updateProcessMonth(process_month_id);
      if (err) {
        res.status(err.code).send({
          status: "error",
          error: err.text,
        });
      } else {
        res.send(process);
      }
    } catch (error) {
      res.status(500).send({
        status: "error",
        error,
      });
    }
  }
);

// update client image by form data
router.put("/update/image/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const token = req.body.token || req.headers.authorization;
  const client_img = req.file;
  try {
    const { success, err } = await clientController.updateclientImage(
      id,
      client_img,
      token
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

// update client national id images by form data
router.put("/update/national-images/:id", upload.any(), async (req, res) => {
  const { id } = req.params;
  const token = req.body.token || req.headers.authorization;
  const images = req.files;
  const face_national_id_img = images[0];
  const back_national_id_img = images[1];
  try {
    const { success, err } = await clientController.updateclientNationalImages(
      id,
      face_national_id_img,
      back_national_id_img,
      token
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

// get all client
router.get("/", async (req, res) => {
  const token = req.body.token || req.headers.authorization;
  try {
    const { clients, err } = await clientController.getAllClients(token);
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

// get client by id
router.get("/:id", async (req, res) => {
  const token = req.body.token || req.headers.authorization;
  const { id } = req.params;
  try {
    const { client, err } = await clientController.getClientById(id, token);
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
