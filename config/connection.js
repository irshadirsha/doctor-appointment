// const mongoose = require('mongoose');
// const { MongoClient } = require('mongodb');
// const fs = require('fs');
// require('dotenv').config();

// console.log('Mongo URI: configggggg-connectionnnnnnnn', process.env.MONGO_URI);

// const encryptionKey = fs.readFileSync('./master-key.txt');
// const keyVaultNamespace = 'encryption.__keyVault';

// const client = new MongoClient(process.env.MONGO_URI, {
//   autoEncryption: {
//     keyVaultNamespace,
//     kmsProviders: {
//       local: {
//         key: encryptionKey,
//       },
//     },  
//     schemaMap: {
//       'DoctorBooking.users': {
//         bsonType: 'object',
//         properties: {
//           email: {
//             encrypt: {
//               bsonType: 'string',
//               algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
//             },
//           },
//           password: {
//             encrypt: {
//               bsonType: 'string',
//               algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
//             },
//           },
//           otp: {
//             encrypt: {
//               bsonType: 'string',
//               algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
//             },
//           },
//         },
//       },
      
//     },
//   },
// });

// const db = async () => {
//   try {
//     await client.connect(); 
//     console.log('Database Connected successfully with encryption!');
//   } catch (error) {
//     console.log('Error in db connection: ', error);
//   }
// };
 
// module.exports = db;





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

// final one is this iiiiii