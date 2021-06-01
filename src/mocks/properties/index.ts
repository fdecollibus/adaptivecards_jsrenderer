import { RequestHandler } from 'express';
import data from './data.json';

export const requestHandler: RequestHandler = (req, res) => {
  // simulate random delay of response for few seconds
  setTimeout(
    () => {
      res.json(data);
      res.end();
    },
    (Math.floor(Math.random() * 4) + 1) * 1000,
  );
};
