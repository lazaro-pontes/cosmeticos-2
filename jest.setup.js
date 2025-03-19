const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const User = require("./src/models/User");

let mongoServer;
process.env.NODE_ENV = "test";

// Inicia o banco antes de todos os testes
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGO_URI_TEST = uri;

    await mongoose.connect(uri);
});


// Fecha o banco e desconecta após os testes

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});