const taskModel = require("../model/Task");
const express = require("express");
const router = express.Router();

// ADDING A NEW TASK
router.post("/", async (req, res) => {
  try {
    const newTask = new taskModel({
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET ALL TASK THAT HAS BEEN CREATED
router.get("/", async (req, res) => {
  try {
    const tasks = await taskModel.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET A SINGLE TASK BY ID
router.get("/:id", async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// EDIT TASK BY ID
router.put("/:id", async (req, res) => {
  try {
    const editTask = await taskModel.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
      },
      { new: true, runValidators: true }
    );

    if (!editTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(editTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE TASK BY ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await taskModel.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
