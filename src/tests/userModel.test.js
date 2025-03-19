const User = require("../models/User");

describe("Testes do Modelo User", () => {
    // Limpa os dados do banco antes de cada teste
    afterEach(async () => {
        await User.deleteMany();
    });

    it("Deve criar um usuário válido", async () => {
        const user = new User({
            name: "Teste",
            email: "teste@email.com",
            password: "senha123",
        });
        await user.save();
        expect(user._id).toBeDefined();
        expect(user.createdAt).toBeDefined();
    });

    it("Deve falhar ao criar um usuário sem email", async () => {
        const user = new User({
            name: "Teste",
            password: "senha123",
        });
        await expect(user.save()).rejects.toThrow();
    });

    it("Deve garantir que emails são únicos", async () => {
        await User.create({
            name: "Teste",
            email: "teste@email.com",
            password: "senha123",
        });
        const duplicateUser = new User({
            name: "Outro Teste",
            email: "teste@email.com",
            password: "senha123",
        });
        await expect(duplicateUser.save()).rejects.toThrow();
    });
});
