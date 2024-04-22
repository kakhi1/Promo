const redis = require("redis");
const client = redis.createClient({ legacyMode: true }); // Configure as needed for your Redis version
client.connect().catch(console.error);

module.exports = client;
