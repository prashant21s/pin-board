const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    imageText: {
      type: String,
      default: "",
      trim: true
    },
    image: {
      type: String

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    date: {
      type: Date,
      default: Date.now
    },

    time: {
      type: String,
      default: () => new Date().toLocaleTimeString()
    },

    likes: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Post", postSchema);

 