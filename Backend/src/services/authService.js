const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SALT_ROUNDS = 10;
const JWT_EXPIRES = "7d";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET must be set in Backend/.env (at least 16 characters).");
  }
  return secret;
}

let persistenceEnabled = false;

function setPersistenceEnabled(value) {
  persistenceEnabled = Boolean(value);
}

const memoryByEmail = new Map();
const memoryById = new Map();

function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name || "",
  };
}

function signToken(userId) {
  return jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: JWT_EXPIRES });
}

function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

function validateCredentials(email, password) {
  const trimmedEmail = String(email || "").trim().toLowerCase();
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    const error = new Error("Please enter a valid email address.");
    error.status = 400;
    throw error;
  }
  const pw = String(password || "");
  if (pw.length < 8) {
    const error = new Error("Password must be at least 8 characters.");
    error.status = 400;
    throw error;
  }
  return { email: trimmedEmail, password: pw };
}

async function register({ email, password, name }) {
  const { email: normalizedEmail, password: rawPassword } = validateCredentials(email, password);
  const displayName = String(name || "").trim();

  if (persistenceEnabled) {
    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      const error = new Error("An account with this email already exists.");
      error.status = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(rawPassword, SALT_ROUNDS);
    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      name: displayName,
    });

    const publicUser = { id: user._id.toString(), email: user.email, name: user.name };
    return { user: publicUser, token: signToken(publicUser.id) };
  }

  if (memoryByEmail.has(normalizedEmail)) {
    const error = new Error("An account with this email already exists.");
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(rawPassword, SALT_ROUNDS);
  const id = crypto.randomUUID();
  const user = { id, email: normalizedEmail, passwordHash, name: displayName };
  memoryByEmail.set(normalizedEmail, user);
  memoryById.set(id, user);

  return { user: toPublicUser(user), token: signToken(id) };
}

async function login({ email, password }) {
  const { email: normalizedEmail, password: rawPassword } = validateCredentials(email, password);

  if (persistenceEnabled) {
    const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash").exec();
    if (!user) {
      const error = new Error("Invalid email or password.");
      error.status = 401;
      throw error;
    }

    const ok = await bcrypt.compare(rawPassword, user.passwordHash);
    if (!ok) {
      const error = new Error("Invalid email or password.");
      error.status = 401;
      throw error;
    }

    const publicUser = { id: user._id.toString(), email: user.email, name: user.name };
    return { user: publicUser, token: signToken(publicUser.id) };
  }

  const user = memoryByEmail.get(normalizedEmail);
  if (!user) {
    const error = new Error("Invalid email or password.");
    error.status = 401;
    throw error;
  }

  const ok = await bcrypt.compare(rawPassword, user.passwordHash);
  if (!ok) {
    const error = new Error("Invalid email or password.");
    error.status = 401;
    throw error;
  }

  return { user: toPublicUser(user), token: signToken(user.id) };
}

async function getUserById(userId) {
  if (!userId) {
    return null;
  }

  if (persistenceEnabled) {
    const user = await User.findById(userId).lean();
    if (!user) {
      return null;
    }
    return { id: user._id.toString(), email: user.email, name: user.name || "" };
  }

  const user = memoryById.get(userId);
  return user ? toPublicUser(user) : null;
}

module.exports = {
  setPersistenceEnabled,
  register,
  login,
  getUserById,
  verifyToken,
};
