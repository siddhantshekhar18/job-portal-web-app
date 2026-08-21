const jwt = require("jsonwebtoken");
const {
  findUserByEmail,
  findUserById,
  createUser,
  verifyPassword,
  sanitizeUser,
} = require("../services/userService");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const newUser = await createUser(name.trim(), normalizedEmail, password);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);
    const safeUser = sanitizeUser(user);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  me,
};
