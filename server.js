const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'chatbot_db',
  password: 'Dvshetty+-123',
  port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database Connected");
  }
});

app.post('/save-chat', async (req, res) => {

  console.log("Request received");
  console.log(req.body);

  const {
    conversation_id,
    user_id,
    sender,
    message
  } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO messages
      (conversation_id, user_id, sender, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [
        conversation_id,
        user_id,
        sender,
        message
      ]
    );

    console.log("INSERTED:", result.rows[0]);

    res.send('Saved');

  } catch (err) {

    console.log(err);
    res.status(500).send('Error');

  }

});
app.listen(3000, () => {
  console.log('Server running on port 3000');
});