const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook"

const connectToMongo = async () => {
    try{
    await mongoose.connect(mongoURI, {} ); 
        console.log("connected to mongo successfully");
    }
    catch(error) {
        console.error("failed to connect to mongodb", error);
    }
}

module.exports = connectToMongo;
