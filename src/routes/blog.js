const express = require("express");
const db = require("../services/supabase");
const handleError = require("../utils/errorHandler");

const router = express.Router();

// Helper function to handle database operations
const handleDatabaseOperation = async (operation, res) => {
  try {
    const { data, error } = await operation();
    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, res);
    return null;
  }
};

// Read all blog posts (GET /blog)
router.get("/", async (req, res) => {
  const data = await handleDatabaseOperation(
    () => db.from("blog").select(),
    res
  );
  if (data) res.json(data);
});

// Create a new blog post (POST /blog)
router.post("/", async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }

  const data = await handleDatabaseOperation(
    () => db.from("blog").insert({ title, description }),
    res
  );
  if (data) res.status(201).json(data);
});

// Read a specific blog post (GET /blog/:id)
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data = await handleDatabaseOperation(
    () => db.from("blog").select().eq("id", id),
    res
  );
  if (data && data.length > 0) {
    res.json(data[0]);
  } else {
    res.status(404).json({ message: "Post not found" });
  }
});

// Update a specific blog post (PUT /blog/:id)
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, description } = req.body;

  if (!title && !description) {
    return res
      .status(400)
      .json({ message: "Title or description is required" });
  }

  const data = await handleDatabaseOperation(
    () => db.from("blog").update({ title, description }).eq("id", id),
    res
  );
  if (data && data.length > 0) {
    res.json(data[0]);
  } else {
    res.status(404).json({ message: "Post not found" });
  }
});

// Delete a specific blog post (DELETE /blog/:id)
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data = await handleDatabaseOperation(
    () => db.from("blog").delete().eq("id", id),
    res
  );
  if (data && data.length > 0) {
    res.json({ message: "Post deleted successfully" });
  } else {
    res.status(404).json({ message: "Post not found" });
  }
});

module.exports = router;
