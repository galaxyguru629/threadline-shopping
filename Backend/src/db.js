const mongoose = require("mongoose");

function getMongoUri() {
  return process.env.MONGO_URI || "mongodb://127.0.0.1:27017/threadline_market";
}

async function connectToDatabase() {
  const mongoUri = getMongoUri();
  await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${mongoUri}`);
}

module.exports = {
  connectToDatabase,
};

