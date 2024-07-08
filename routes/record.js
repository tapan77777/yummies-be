// require('dotenv').config();
const mongoose = require("mongoose");
// mongoose.connect(process.env.MONGO_URI);
mongoose.connect(
  "mongodb+srv://yummies520:k4Riw7bZwvnmcyPZ@cluster0.1nfia5a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const recordSchema = new mongoose.Schema({
  itemName: [],
  customer: {
    CName: { type: String },
    CNumber: { type: Numbe },
  },
  createdDate: {
    type: Date,
    required: true
  },
});

module.exports = mongoose.model("Record", recordSchema);
