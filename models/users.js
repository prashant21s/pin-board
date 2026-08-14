const mongoose = require("mongoose");
const plm = require("passport-local-mongoose").default;

// mongoose.connect(process.env.MONGO_URI);
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password:{
      type: String
    },

    isVerified: {
    type: Boolean,
    default: false
    },
    
    verificationToken: {
    type: String
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    fullname: {
      type: String,
      required: true,
      trim: true
    },

    dp: {
      type: String,
      default: ""
    },

    posts: [{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Post'
    }
      
    ]
  },
  
);
userSchema.plugin(plm);
module.exports = mongoose.model("User", userSchema);

