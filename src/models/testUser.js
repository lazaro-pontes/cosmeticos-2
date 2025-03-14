const mongoose = require("mongoose");
const User = require("./User");
const { mongoUri } = require("../config/config");

mongoose.connect(mongoUri);

async function test() {
  const user = new User({
    name: "João",
    email: "joao@email.com",
    password: "senha123",
  });
  await user.save();
  console.log("Usuário salvo com sucesso:", user);
  mongoose.connection.close();
}

test();
