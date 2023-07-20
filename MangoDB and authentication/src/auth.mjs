import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const startAuthenticatedSession = (req, user, cb) => {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) {
        reject(err);
      } else {
        req.session.user = user; 
        resolve(user);
      } 
    });
  });
};

const endAuthenticatedSession = (req, cb) => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export {
  startAuthenticatedSession,
  endAuthenticatedSession
};
