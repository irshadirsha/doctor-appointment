
// require('dotenv').config();const { MongoClient, ClientEncryption } = require('mongodb');
// const fs = require('fs');

// async function createKey() {
//     console.log('Mongo URI: in create keyyyyyyyyyyyyyyyyyyyy', process.env.MONGO_URI);

//   const encryptionKey = fs.readFileSync('./master-key.txt'); 
//   const client = new MongoClient(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   await client.connect();

//   const encryption = new ClientEncryption(client, {
//     keyVaultNamespace: 'encryption.__keyVault',
//     kmsProviders: {
//       local: {
//         key: encryptionKey,
//       },
//     },
//   });

//   // Generate a new data encryption key
//   const key = await encryption.createDataKey('local');
//   console.log('Data encryption key created:', key.toString('base64'));

//   await client.close();
// }

// createKey();
