import { RequestHandler } from 'express';
import { errorResponse } from '../functions';
import getData from './get/data.json';
import postData from './post/data.json';

export const requestHandler: RequestHandler = (req, res) => {
  // const { partnerNumber } = req.params;

  try {
    switch (req.method) {
      case 'POST': {
        res.json(postData);
        break;
      }
      case 'GET':
      default: {
        res.json({
          ...getData,
          // offerGroups: [], // remove comment to simulate no offers
        });
      }
    }
  } catch (err) {
    errorResponse(res);
  }

  res.end();
};
