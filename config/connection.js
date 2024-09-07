const mongoose = require ('mongoose')
require('dotenv').config()
const db=()=>{
        mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Database Connected succesfully!'))
  .catch((err)=>{
    console.log("error in db connection..",err)
  })
    
}

module.exports=db