import express from 'express';

export const helloRouter = express.Router();

helloRouter.get('/hello', (req, res) => {
  res.json({ message: 'Hello from Logikids Backend!' });
}); 