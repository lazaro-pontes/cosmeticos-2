const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = require("../app");
const User = require("../models/User");
const { jwtSecret } = require("../config/config");

describe("Rotas de Usuários - Register, Login", () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe("POST /api/users/register", () => {
        it("Deve registrar um novo usuário", async () => {
            const res = await request(app).post("/api/users/register").send({
                name: "Teste",
                email: "teste@email.com",
                password: "senha123",
            });
            expect(res.statusCode).toBe(201);
            expect(res.body.user).toHaveProperty("id");
        });

        it("Deve falhar ao registrar um usuário já existente", async () => {
            await User.create({
                name: "Teste",
                email: "teste@email.com",
                password: "senha123",
            });

            const res = await request(app).post("/api/users/register").send({
                name: "Teste",
                email: "teste@email.com",
                password: "senha123",
            });
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Usuário já registrado.");
        });
    });

    describe("POST /api/users/login", () => {
        beforeEach(async () => {
            await User.create({
                name: "Teste",
                email: "teste@email.com",
                password: await bcrypt.hash("senha123", 10),
            });
        });

        it("Deve fazer login com credenciais válidas", async () => {
            const res = await request(app).post("/api/users/login").send({
                email: "teste@email.com",
                password: "senha123",
            });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("token");
        });

        it("Deve falhar ao logar com credenciais inválidas", async () => {
            const res = await request(app).post("/api/users/login").send({
                email: "teste@email.com",
                password: "senhaerrada",
            });
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe("Credenciais inválidas");
        });
    });
});

describe("Rotas de Usuários - Atualização, Exclusão e Listagem", () => {
    let adminToken, userToken, testUserId;

    //Criar um admin e um usuário antes de todos os testes
    beforeAll(async () => {
        // Cria um admin
        const admin = await User.create({
            name: "Admin",
            email: "admin@email.com",
            password: await bcrypt.hash("senha123", 10),
            isAdmin: true,
        });

        // Cria um usuário comum
        const user = await User.create({
            name: "User",
            email: "user@email.com",
            password: await bcrypt.hash("senha123", 10),
            isAdmin: false,
        });

        // Salva os IDs e dados iniciais
        testUserId = user._id;
        initialAdmin = { ...admin.toObject() };
        initialUser = { ...user.toObject() };

        // Gera tokens para ambos
        adminToken = jwt.sign({ id: admin._id, isAdmin: admin.isAdmin }, jwtSecret, { expiresIn: "1h" });
        userToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, jwtSecret, { expiresIn: "1h" });
    });

    // Restaura o estado inicial dos usuários após cada teste
    afterEach(async () => {
        await User.findByIdAndUpdate(initialAdmin._id, {
            name: initialAdmin.name,
            email: initialAdmin.email,
            isAdmin: initialAdmin.isAdmin,
        });

        await User.findByIdAndUpdate(initialUser._id, {
            name: initialUser.name,
            email: initialUser.email,
            isAdmin: initialUser.isAdmin,
        });
    });

    describe("GET /api/users", () => {
        it("Deve listar todos os usuários quando for admin", async () => {
            const res = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        });

        it("Deve falhar ao listar usuários sem token", async () => {
            const res = await request(app).get("/api/users");
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe("Não autorizado, sem token");
        });

        it("Deve falhar ao listar usuários com token de um não-admin", async () => {
            const res = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe("Acesso negado, somente administradores podem realizar esta ação.");
        });
    });

    describe("PUT /api/users/:id", () => {
        it("Deve atualizar um usuário quando for admin", async () => {
            const res = await request(app)
                .put(`/api/users/${testUserId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "User Updated", isAdmin: true });

            expect(res.statusCode).toBe(200);
            expect(res.body.name).toBe("User Updated");
            expect(res.body.isAdmin).toBe(true);
        });

        it("Deve falhar ao tentar atualizar sem token", async () => {
            const res = await request(app).put(`/api/users/${testUserId}`).send({ name: "Hacker" });
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe("Não autorizado, sem token");
        });

        it("Deve falhar ao tentar atualizar com token de um não-admin", async () => {
            const res = await request(app)
                .put(`/api/users/${testUserId}`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({ name: "User Trying Update" });

            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe("Acesso negado, somente administradores podem realizar esta ação.");
        });
    });

    describe("DELETE /api/users/:id", () => {
        it("Deve excluir um usuário quando for admin", async () => {
            const res = await request(app)
                .delete(`/api/users/${testUserId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Usuário removido com sucesso.");
        });

        it("Deve falhar ao tentar excluir sem token", async () => {
            const res = await request(app).delete(`/api/users/${testUserId}`);
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe("Não autorizado, sem token");
        });

        it("Deve falhar ao tentar excluir com token de um não-admin", async () => {
            const res = await request(app)
                .delete(`/api/users/${testUserId}`)
                .set("Authorization", `Bearer ${userToken}`);

            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe("Acesso negado, somente administradores podem realizar esta ação.");
        });
    });
});