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

// Get a single user by ID
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await sequelize.query(`SELECT * FROM users WHERE id = :id`, {
      replacements: { id },
    });
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching user", details: error.message });
  }
});

// Create a new user
// Create a new user
app.post("/users", async (req, res) => {
  const { username, email, password, role, department } = req.body;

  console.log("Request Body:", req.body); // Log the request body for debugging

  // Check if all fields are present
  if (!username || !email || !password || !role || !department) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await sequelize.query(
      `INSERT INTO users (username, email, password, role, department) VALUES (:username, :email, :password, :role, :department) RETURNING *`,
      {
        replacements: { username, email, password, role, department },
      }
    );

    res.status(201).json(result[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating user", details: error.message });
  }
});

// Update a user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role, department } = req.body;
  try {
    const [result] = await sequelize.query(
      `UPDATE users SET username = :username, email = :email, password = :password, role = :role, department = :department WHERE id = :id RETURNING *`,
      {
        replacements: { id, username, email, password, role, department },
      }
    );
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating user", details: error.message });
  }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await sequelize.query(
      `DELETE FROM users WHERE id = :id RETURNING *`,
      {
        replacements: { id },
      }
    );
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting user", details: error.message });
  }
});

// Get all tickets
app.get("/tickets", async (req, res) => {
  try {
    // Perform raw SQL query to fetch all columns from tickets
    const [tickets] = await sequelize.query("SELECT * FROM tickets");
    res.status(200).json(tickets);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching tickets", details: error.message });
  }
});

// Get a single ticket by ID
app.get("/tickets/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [ticket] = await sequelize.query(
      `SELECT * FROM tickets WHERE id = :id`,
      {
        replacements: { id },
      }
    );
    if (ticket.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json(ticket[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching ticket", details: error.message });
  }
});

// Delete a ticket
app.delete("/tickets/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await sequelize.query(
      `DELETE FROM tickets WHERE id = :id RETURNING *`,
      {
        replacements: { id },
      }
    );
    if (result.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting ticket", details: error.message });
  }
});

// Listen on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
