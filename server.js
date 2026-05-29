const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
  console.log(
    "DATABASE_URL starts with:",
    process.env.DATABASE_URL.substring(0, 30)
  );
}
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// ✅ Use DATABASE_URL from Render (Supabase connection)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ✅ Test DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log("DB Connection Error:", err);
  } else {
    console.log("Database Connected");
  }
});

// ✅ API to save chat
app.post('/save-chat', async (req, res) => {
  console.log("Request received:", req.body);

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

    res.status(200).send('Saved');

  } catch (err) {
    console.log("Insert Error:", err);
    res.status(500).send('Error saving message');
  }
});

// ✅ Use dynamic port for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
