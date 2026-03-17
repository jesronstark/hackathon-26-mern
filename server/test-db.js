const mongoose = require('mongoose');
const uri = "mongodb+srv://jesronnn_db_user:eD0thPnMpHiPqEd7@cluster0.vjnl8ff.mongodb.net/hackathon26?retryWrites=true&w=majority";

console.log('Testing connection to:', uri.replace(/:.+@/, ':****@'));

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Local test: Connection SUCCESSFUL!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Local test: Connection FAILED!');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    process.exit(1);
  });
