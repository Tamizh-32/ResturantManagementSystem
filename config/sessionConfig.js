const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

// Use the MongoDB connection string from environment variables or a default local URI
const mongoUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/RMSDB';

const sessionStore = MongoStore.create({
  mongoUrl, // Provide the MongoDB connection string directly
  collectionName: 'sessions',
  ttl: 10 * 24 * 60 * 60, // 10 days
});

module.exports = session({
  secret: process.env.SESSION_SECRET || 'tamizh32',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies only in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  }
});