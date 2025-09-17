const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt'); // serve para criptografar a senha no BD.
const db = require('../db/database');

const app = express();
app.use(cors()); // Libera acesso de outras origens
app.use(express.json()); // Permite receber JSON no body das requisições


const PORT = 3000;
const SALT_ROUNDS = 10; // Número de rounds para o bcrypt

// Rota para registrar um novo usuário
app.post("/api/users", async (req, res) => {
    try {
        // ✅ Correção: antes estava com colchetes [ ], agora usamos { }
        const { nome, email, senha } = req.body;

        // Validação dos campos obrigatórios
        if (!nome || !email || !senha) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios."
            });
        }

        const emailLowerCase = email.toLowerCase();

        // Verificar se o email já existe
        const [rows] = await db.query(
            "SELECT id FROM usuarios WHERE email = ?", 
            [emailLowerCase]
        );

        if (rows.length > 0) {
            return res.status(409).json({ error: "Email já cadastrado." });
        }

        // Criptografia da senha
        const passwordHash = await bcrypt.hash(senha, SALT_ROUNDS);

        // ✅ Correção: adicionamos o campo createdAt com NOW()
        const [result] = await db.query(
            "INSERT INTO usuarios (nome, email, passwordHash, createdAt) VALUES (?, ?, ?, NOW())",
            [nome, emailLowerCase, passwordHash]
        );

        const id = result.insertId;

        res.status(201).json({
            id,
            nome,
            email: emailLowerCase
        });

    } catch (error) {
        console.error("Erro ao criar o usuário:", error.message); // ✅ Log melhorado
        res.status(500).json({
            error: "Erro interno ao criar o usuário."
        });
    }
});

// Método GET para listar todos os usuários
app.get("/api/users", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, nome, email, createdAt FROM usuarios");
        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar usuários: ", error.message);
        res.status(500).json({
            error: "Erro interno ao buscar usuários."
        });
    }
});

// método GET para buscar usuários por ID ou buscar pelo nome, dependendo do tipo do projeto.
app.get("/api/users/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query("SELECT id, nome, email, createdAt FROM usuarios WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Erro ao buscar usuário por ID: ", error.message);
        res.status(500).json({
            // erro de servidor
            error: "Erro interno ao buscar usuário."
        });
    }
});

app.put("/api/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha } = req.body;

        // Verificar se o usuário existe antes de tentar atualizar
        const [rows] = await db.query("SELECT * FROM usuarios WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const user = rows[0];

        // Definir novos valores ou manter os antigos
        const updatedName = nome !== undefined ? nome : user.nome;
        const updatedEmail = email !== undefined ? email : user.email;

        let updatedPasswordHash = user.passwordHash;
        // Atualiza a senha APENAS se o campo 'senha' for enviado e não estiver vazio
        if (senha) {
            updatedPasswordHash = await bcrypt.hash(senha, SALT_ROUNDS);
        }

        // Atualizar usuário no banco
        await db.query(
            "UPDATE usuarios SET nome = ?, email = ?, passwordHash = ? WHERE id = ?",
            [updatedName, updatedEmail, updatedPasswordHash, id]
        );

        res.json({
            id,
            nome: updatedName,
            email: updatedEmail
        });

    } catch (error) {
        console.error("Erro ao atualizar usuário:", error.message);
        res.status(500).json({
            error: "Erro interno ao atualizar usuário."
        });
    }
});

// Rota para deletar um usuário pelo ID
app.delete("/api/users/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar se o usuário existe
        const [rows] = await db.query("SELECT id FROM usuarios WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        // Deletar o usuário
        await db.query("DELETE FROM usuarios WHERE id = ?", [id]);

        res.json({ message: `Usuário de ID ${id} foi deletado com sucesso.` });

    } catch (error) {
        console.error("Erro ao deletar usuário:", error.message);
        res.status(500).json({
            error: "Erro interno ao deletar usuário."
        });
    }
});


// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});