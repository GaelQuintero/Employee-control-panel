const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//Conexion a base de datos
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crudreact",
});

// Configuración de multer con validación de tipo de archivo
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Solo aceptar archivos .jpg
    if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
      return cb(new Error("Only .jpg and .jpeg format allowed!"), false);
    }
    cb(null, true);
  },
});

//Codigo para registrar empleados a la base de datos 'employees'

app.post("/create", upload.single("image"), (req, res) => {
  const { name, age, city, charge, years } = req.body;
  const image = req.file ? req.file.buffer : null;

  db.query(
    "INSERT INTO employees(name, age, city, charge, years, image) VALUES(?,?,?,?,?,?)",
    [name, age, city, charge, years, image],
    (error) => {
      if (error) {
        return res
          .status(500)
          .json({
            success: false,
            message: "Failed to register user. Please try again later.",
          });
      }
      res
        .status(200)
        .json({ success: true, message: "User registered successfully!" });
    }
  );
});

app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employees", (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send("An error occurred");
      return;
    }
    res.json(result);
  });
});

app.get("/image/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT image FROM employees WHERE idEmployee = ?",
    [id],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send("An error occurred");
      }

      if (results.length > 0 && results[0].image) {
        res.contentType("image/jpeg/png"); // Establece el tipo de contenido para imágenes JPEG
        res.send(results[0].image);
      } else {
        res.status(404).send("Image not found");
      }
    }
  );
});

app.delete("/delete/:idEmployee", (req, res) => {
  const { idEmployee } = req.params;

  db.query(
    "DELETE FROM employees WHERE idEmployee = ?",
    [idEmployee],
    (error, results) => {
      if (error) {
        console.error("Error deleting employee:", error);
        return res
          .status(500)
          .json({
            success: false,
            message: "Failed to delete employee. Please try again later.",
          });
      }
      if (results.affectedRows > 0) {
        return res
          .status(200)
          .json({ success: true, message: "Employee deleted successfully!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Employee not found." });
      }
    }
  );
});

app.post("/update/:idEmployee", upload.single("image"), (req, res) => {
  const { name, age, city, charge, years } = req.body;
  const image = req.file ? req.file.buffer : null;
  const { idEmployee } = req.params;

  const query = `
    UPDATE employees 
    SET name = ?, age = ?, city = ?, charge = ?, years = ?, image = ?
    WHERE idEmployee = ?
  `;

  const values = [name, age, city, charge, years, image, idEmployee];

  db.query(query, values, (error) => {
    if (error) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to update user. Please try again later.",
        });
    }
    res
      .status(200)
      .json({ success: true, message: "User updated successfully!" });
  });
});

app.listen(3001, () => {
  console.log("Running on port 3001");
});
