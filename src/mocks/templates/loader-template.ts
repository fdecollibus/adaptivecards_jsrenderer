import express from 'express';
import { errorResponse } from '../functions';

export const router = express.Router();

// here we import all the routes
// tslint:disable
/*___REPLACE_HERE___*/

router.use('/', (req, res) => {
  errorResponse(res, 'no EP defined for given URL. Add it to url-schema.json');
  res.end();
});
