const { Schema, model } = require("mongoose");
const now = require('../utils/formatDate.js')

const messageSchema = new Schema({
  author: {
            email: {
                    type: String,
                    maxlength: 100,
                    },
            name: {
                    type: String,
                    maxlength: 100,
                    },
            lastName: {
                    type: String,
                    maxlength: 100,
                    },
            alias: {
                    type: String,
                    },
            avatar: {
                    type: String,
                    },
  },
  text: {
      type: String,
      maxlength: 300,
    },
  date: {
      type: String,
      default: now,
    },
  status: {
        type: Boolean,
        default: true,
  }  
});

module.exports = model("Mensajes", messageSchema);