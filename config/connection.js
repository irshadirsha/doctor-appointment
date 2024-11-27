const mongoose = require('mongoose');
const { MongoClient, Binary } = require('mongodb');
const { ClientEncryption } = require('mongodb-client-encryption');
require('dotenv').config();

const keyVaultNamespace = 'encryption.__keyVault';

const masterKey = Buffer.from(process.env.MASTER_KEY, 'base64');
const kmsProviders = { local: { key: masterKey } };

const client = new MongoClient(process.env.MONGO_URI, { 
  autoEncryption: {
    keyVaultNamespace,
    kmsProviders,   
    schemaMap: {                                  
      'DoctorBooking.users': {
        bsonType: 'object',
        encryptMetadata: {
          keyId: [new Binary(Buffer.from(process.env.KEY_ID, 'base64'), 4)]
      },
        properties: {
          email: { 
            encrypt: {
              bsonType: 'string',
              algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',  
            },   
          },
          password: {
            encrypt: {
              bsonType: 'string',
              algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',  
            },
          },
          otp: {
            encrypt: {
              bsonType: 'string',
              algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
            },
          },
        },
      },
    },
  },
});


const db = async () => {
  try {
    await client.connect();
    console.log('MongoDB client connected successfully with encryption!');

    await mongoose.connect(process.env.MONGO_URI);

    console.log('Mongoose connected successfully to the database!');
  } catch (error) {
    console.log('Error in db connection:', error);
  }
};


async function createKey() {
  try {
    console.log("inside create key functon")
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();

    const encryption = new ClientEncryption(mongoClient, { keyVaultNamespace, kmsProviders });
    const keyId = await encryption.createDataKey('local');

    await mongoClient.close();

    console.log('New encryption key created:', keyId.toString('base64'));
    return keyId.toString('base64');
  } catch (error) {
    console.error('Error creating encryption key:', error);
  }
}

module.exports = { db, client, createKey };



// const mongoose = require('mongoose');
// const { MongoClient, Binary } = require('mongodb');
// const fs = require('fs');
// require('dotenv').config();
// const { randomUUID } = require('crypto');
// const uuid = randomUUID().replace(/-/g, '');
// const buffer = Buffer.from(uuid, 'hex');
// const base64UUID = buffer.toString('base64');
// console.log(base64UUID);

// console.log('Mongo URI:', process.env.MONGO_URI);

// const keyVaultNamespace = 'encryption.__keyVault';

// // Load the master key and define kmsProviders
// const masterKey = Buffer.from(process.env.MASTER_KEY, 'base64');
// const kmsProviders = { local: { key: masterKey } };

// // Correct keyId initialization with UUID (4) subtype
// const keyId = new Binary(Buffer.from(process.env.KEY_ID, 'base64'), Binary.SUBTYPE_UUID);

// // Configure MongoDB Client with encryption enabled
// const client = new MongoClient(process.env.MONGO_URI, {
//   autoEncryption: {
//     keyVaultNamespace,
//     kmsProviders, // Reference kmsProviders here
//     schemaMap: {
//       'DoctorBooking.users': {
//         bsonType: 'object',
//         encryptMetadata: {
//           keyId: [new Binary(Buffer.from(process.env.KEY_ID, 'base64'), 4)]
//         },
//         properties: {
//           email: {
//             encrypt: {
//               bsonType: 'string',
//               algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
//               keyId: [keyId],
//             },
//           },
//           password: {
//             encrypt: {
//               bsonType: 'string',
//               algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
//               keyId: [keyId],
//             },
//           },
//           otp: {
//             encrypt: {
//               bsonType: 'string',
//               algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
//               keyId: [keyId],
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
//     console.log('MongoDB client connected successfully with encryption!');

//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log('Mongoose connected successfully to the database!');
//   } catch (error) {
//     console.log('Error in db connection:', error);
//   }
// };

// module.exports = { db, client };




// const mongoose = require('mongoose');
// const { MongoClient, Binary } = require('mongodb');
// const fs = require('fs');
// require('dotenv').config();
// const { randomUUID } = require('crypto');
// const uuid = randomUUID().replace(/-/g, ''); // Remove dashes for a 16-byte UUID
// const buffer = Buffer.from(uuid, 'hex');
// const base64UUID = buffer.toString('base64');
// console.log(base64UUID);



// console.log('Mongo URI:', process.env.MONGO_URI);

// // Load encryption key
// const encryptionKey = fs.readFileSync('./master-key.txt');
// const keyVaultNamespace = 'encryption.__keyVault'; // Ensure this matches the actual database.collection

// // Correct keyId initialization with UUID (4) subtype
// const keyId = new Binary(Buffer.from(process.env.KEY_ID, 'base64'), Binary.SUBTYPE_UUID);

// // Configure MongoDB Client with encryption enabled
// const client = new MongoClient(process.env.MONGO_URI, {
//   autoEncryption: {
//     keyVaultNamespace, // Matches the exact database.collection in MongoDB
//     kmsProviders: {
//       local: {
//         key: encryptionKey, // The encryption key loaded from master-key.txt
//       },
//     },
//     schemaMap: {
//       'DoctorBooking.users': { // Matches the collection in MongoDB
//         bsonType: 'object',
//         encryptMetadata: {
//           keyId: [new Binary(Buffer.from(process.env.KEY_ID, 'base64'), 4)]
//         },
//         properties: {
//           email: {
//             encrypt: {
//               bsonType: 'string',
//               algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
//               keyId: [keyId],
//             },
//           },
//           password: {
//             encrypt: {
//               bsonType: 'string',
//               algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
//               keyId: [keyId],
//             },
//           },
//           otp: {
//             encrypt: {
//               bsonType: 'string',
//               algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
//               keyId: [keyId],
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
//     console.log('MongoDB client connected successfully with encryption!');

//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log('Mongoose connected successfully to the database!');
//   } catch (error) {
//     console.log('Error in db connection:', error);
//   }
// };

// module.exports = { db, client };



// const mongoose = require('mongoose');
// const { MongoClient, Binary } = require('mongodb');
// const fs = require('fs');
// require('dotenv').config();

// console.log('Mongo URI:', process.env.MONGO_URI);

// // Load encryption key
// const encryptionKey = fs.readFileSync('./master-key.txt');
// const keyVaultNamespace = 'encryption.__keyVault'; // Ensure this matches the actual database.collection

// // Ensure KEY_ID in .env is base64 encoded
// const keyId = new Binary(Buffer.from(process.env.KEY_ID, 'base64'), Binary.SUBTYPE_UUID); // Validate that KEY_ID is correctly set

// // Configure MongoDB Client with encryption enabled
// const client = new MongoClient(process.env.MONGO_URI, {
//   autoEncryption: {
//     keyVaultNamespace, // Make sure this matches the exact database.collection in MongoDB
//     kmsProviders: {
//       local: {
//         key: encryptionKey, // The encryption key loaded from master-key.txt
//       },
//     },
//     schemaMap: {
//       'DoctorBooking.users': { // Make sure this matches the collection in MongoDB
//         bsonType: 'object',
//         properties: {
//           email: {
//             encrypt: {
//               bsonType: 'string',
//               algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
//               keyId: [keyId], // keyId needs to be correct and exist in the key vault
//             },
//           },
//           password: {
//             encrypt: {
//               bsonType: 'string',
//               algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
//               keyId: [keyId], // keyId added here
//             },
//           },
//           otp: {
//             encrypt: {
//               bsonType: 'string',
//               algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
//               keyId: [keyId], // keyId added here
//             },
//           },
//         },
//       },
//     },
//   },
// });

// // Function to connect to the database
// const db = async () => {
//   try {
//     // Connect the MongoDB client
//     await client.connect();
//     console.log('MongoDB client connected successfully with encryption!');

//     // Connect Mongoose using the same Mongo URI
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log('Mongoose connected successfully to the database!');

//     // Check and log Mongoose connection state
//     if (mongoose.connection.readyState === 1) {
//       console.log('Mongoose connection is ready (connected)');
//     } else {
//       console.log('Mongoose connection is not fully ready:', mongoose.connection.readyState);
//     }
//   } catch (error) {
//     console.log('Error in db connection:', error);
//   }
// };

// module.exports = { db, client };



// const mongoose = require('mongoose');
// const { MongoClient, Binary } = require('mongodb');
// const fs = require('fs');
// require('dotenv').config();

// console.log('Mongo URI:', process.env.MONGO_URI);

// // Load encryption key
// const encryptionKey = fs.readFileSync('./master-key.txt');
// const keyVaultNamespace = 'encryption.__keyVault';

// // Define the keyId here
// const keyId = new Binary(Buffer.from(process.env.KEY_ID, 'base64'), Binary.SUBTYPE_UUID); // Using key from .env file

// // Configure MongoDB Client with encryption enabled
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
//               keyId: [keyId], // keyId added here
//             },
//           },
//           password: {
//             encrypt: {
//               bsonType: 'string',
//               algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
//               keyId: [keyId], // keyId added here
//             },
//           },
//           otp: {
//             encrypt: {
//               bsonType: 'string',
//               algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
//               keyId: [keyId], // keyId added here
//             },
//           },
//         },
//       },
//     },
//   },
// });

// // Function to connect to the database
// const db = async () => {
//   try {
//     // Connect the MongoDB client
//     await client.connect();
//     console.log('MongoDB client connected successfully with encryption!');

//     // Connect Mongoose using the same Mongo URI
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log('Mongoose connected successfully to the database!');

//     // Check and log Mongoose connection state
//     if (mongoose.connection.readyState === 1) {
//       console.log('Mongoose connection is ready (connected)');
//     } else {
//       console.log('Mongoose connection is not fully ready:', mongoose.connection.readyState);
//     }
//   } catch (error) {
//     console.log('Error in db connection:', error);
//   }
// };

// module.exports = { db, client };



// const mongoose = require('mongoose');
// const { MongoClient } = require('mongodb');
// const fs = require('fs');
// require('dotenv').config();

// console.log('Mongo URI:', process.env.MONGO_URI);

// // Read encryption key
// const encryptionKey = fs.readFileSync('./master-key.txt');
// const keyVaultNamespace = 'encryption.__keyVault';

// // Configure MongoDB Client with encryption enabled
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
//     // Connect the MongoDB client
//     await client.connect();  // Ensures the MongoDB client is connected before assigning to Mongoose
//     console.log('MongoDB client connected successfully with encryption!');

//     // Now connect Mongoose using the same Mongo URI
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log('Mongoose connected successfully to the database!');

//     // Optional: Log Mongoose connection state for troubleshooting
//     if (mongoose.connection.readyState === 1) {
//       console.log('Mongoose connection is ready (connected)');
//     } else {
//       console.log('Mongoose connection is not fully ready:', mongoose.connection.readyState);
//     }
//   } catch (error) {
//     console.log('Error in db connection:', error);
//   }
// };

// module.exports = { db, client };
// module.exports = db;



// const mongoose = require('mongoose');
// const { MongoClient } = require('mongodb');
// const fs = require('fs');
// require('dotenv').config();

// console.log('Mongo URI:', process.env.MONGO_URI);

// const encryptionKey = fs.readFileSync('./master-key.txt');
// const keyVaultNamespace = 'encryption.__keyVault';

// // Configure MongoDB Client with Encryption
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
//     // Connect MongoDB client with encryption enabled
//     await client.connect()
//     .then(
//       console.log('Database connected successfully')
//     )
//     console.log('Database connected successfully with encryption!');

//     // Assign client connection to Mongoose
//     mongoose.connection = client.db('DoctorBooking');
//   } catch (error) {
//     console.log('Error in db connection: ', error);
//   }
// };

// module.exports = db;



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

//     mongoose.connection = client.db('DoctorBooking');
//   } catch (error) {
//     console.log('Error in db connection: ', error);
//   }
// };
 
// module.exports = db;





// const mongoose = require ('mongoose')
// require('dotenv').config()
// const db=()=>{
//         mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('Database Connected succesfully!'))
//   .catch((err)=>{
//     console.log("error in db connection..",err)
//   })
    
// }

// module.exports=db

// final one is this iiiiii