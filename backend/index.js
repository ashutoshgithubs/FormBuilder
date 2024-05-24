
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'form'
});


// API endpoint to handle survey submission
app.post('/api/survey', (req, res) => {
  console.log("Inside server")
  const { Name, email, satisfaction, feedback } = req.body;
    // console.log(Name,email, satisfaction, feedback);

  const query = 'INSERT INTO survey_results (Name, email, satisfaction, feedback) VALUES (?, ?, ?, ?)';
  db.query(query, [Name, email, satisfaction, feedback], (err, result) => {
    if (err) {
      console.error('Error inserting data: ', err);
      res.status(500).send('Server error');
    } else {
      res.send('Survey results saved');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
