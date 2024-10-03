// import express from 'express';
// // import cors from cors;

// const PORT = process.env.PORT || 3000;

// const app = express();

// app.get('/',(req,res)=>{
//     res.send({'message':'hello world'});
// });

// app.listen(3000,()=>{
//     console.log(`Server is running on port ${PORT}`);
// });

import express from "express";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Sequelize to connect to your PostgreSQL database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false, // Disable logging queries to the console
});

// Define the models for Users and Tickets (no need to define the schema)
const User = sequelize.define(
  "users",
  {},
  { tableName: "users", timestamps: false }
);
const Ticket = sequelize.define(
  "tickets",
  {},
  { tableName: "tickets", timestamps: false }
);

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("Unable to connect to the database:", err));

app.get("/", (req, res) => {
  res.send({ message: "home page" });
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    // Perform raw SQL query to fetch all columns from users
    const [users] = await sequelize.query("SELECT * FROM users");
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching users", details: error.message });
  }
});

// Get all tickets
// app.get("/tickets", async (req, res) => {
//   try {
//     const tickets = await Ticket.findAll(); // Fetch all tickets
//     res.status(200).json(tickets);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Error fetching tickets", details: error.message });
//   }
// });
app.get('/tickets', async (req, res) => {
    try {
      // Perform raw SQL query to fetch all columns from tickets
      const [tickets] = await sequelize.query('SELECT * FROM tickets');
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching tickets', details: error.message });
    }
  });



// Listen on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
