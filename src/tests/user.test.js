const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

// Antes de todos os testes, inicie o banco em memória
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

// Após todos os testes, limpe e desconecte
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});