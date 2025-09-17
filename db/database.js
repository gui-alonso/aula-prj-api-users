const mysql = require('mysql2/promise');
require('dotenv').config(); // caso a gente queira usar variaveis de ambiente


// configuração do Banco de Dados
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'prj_api_users'
});

// importação direto do arquivo do BD.
module.exports = db;