// require('dotenv').config();
const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGO_URI);
const uri = 'mongodb+srv://yummies520:k4Riw7bZwvnmcyPZ@cluster0.1nfia5a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect('mongodb+srv://yummies520:k4Riw7bZwvnmcyPZ@cluster0.1nfia5a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('Connected to MongoDB Atlas');
// }).catch((error) => {
//   console.error('Error connecting to MongoDB Atlas:', error);
// });

mongoose.connect(uri)
const menuSchema = new mongoose.Schema({
  itemName:{
    type: String,
    required: true,
    unique: true
  },
  subMenu:[{}]
});

module.exports = mongoose.model('Menu', menuSchema);