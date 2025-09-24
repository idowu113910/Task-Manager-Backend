const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  tags: {
    type: String,
    enum: ["Urgent", "Important"],
    required: false,
  },
});

module.exports = mongoose.model("Tasks", taskSchema);
