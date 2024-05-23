const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL DB connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',     
  password: 'password', //Need to insert the password here
  database: 'formdb'  
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to database successfully!!');

  // Create table if not exits
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS form (
      id INT AUTO_INCREMENT PRIMARY KEY,
      form_data JSON NOT NULL
    )
  `;
  db.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log('Form table created!!');
  });
});

// Route to save Form json data
app.post('/saveForm', (req, res) => {
  const formData = req.body;
  console.log("hi there")
  console.log(JSON.stringify(formData));
  res.send(JSON.stringify(formData))
  const query = 'INSERT INTO form (form_data) VALUES (?)';
  db.query(query, [JSON.stringify(formData)], (err, result) => {
    if (err) {
      console.error('Error while saving the form:', err);
      return res.status(500).send('Error while saving the form, Check DB once!');
    }
    res.status(200).send('Congrats, form saved successfully!!!');
  });
});



//Let's start the server
app.listen(PORT, () => {
  console.log(`Server is running well on port ${PORT}`);
});







/// ********** Testing at my end ********

// const express = require('express');
// const bodyParser = require('body-parser');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const cors = require('cors');
// const app = express();
// const PORT = 5000;

// app.use(cors());

// // Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Storage configuration for multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = 'uploads/';
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath);
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// // Route to save form JSON
// app.post('/saveForm', (req, res) => {
//   //console.log("Hi here")
//   const formData = req.body;
//   fs.writeFile('form.json', JSON.stringify(formData), (err) => {
//     if (err) {
//       console.error('Error while saving form:', err);
//       return res.status(500).send('Error while saving form');
//     }
//     res.status(200).send('Form saved successfully!');
//   });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });