const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const SALT_ROUNDS = 12;

async function findUserByEmail(email) {
  const result = await pool.query(
    "SELECT id, name, email, password_hash, created_at, updated_at FROM users WHERE email = $1",
    [email],
  );

  return result.rows[0];
}

async function findUserById(id) {
  const result = await pool.query(
    "SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1",
    [id],
  );

  return result.rows[0];
}

async function createUser(name, email, password) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at, updated_at`,
    [name, email, passwordHash],
  );

  return result.rows[0];
}

async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

function sanitizeUser(user) {
  if (!user) return null;

  const { password_hash, ...safeUser } = user;

  return safeUser;
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  verifyPassword,
  sanitizeUser,
};
