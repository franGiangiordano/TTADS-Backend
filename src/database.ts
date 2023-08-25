import mongoose from 'mongoose';
const URI = 'mongodb://127.0.0.1:27017/gestionFlotas';

const connectDB = mongoose.connect(URI)
  .then(db => console.log('Db is connected'))
  .catch(error => console.error(error));
  
export default connectDB;