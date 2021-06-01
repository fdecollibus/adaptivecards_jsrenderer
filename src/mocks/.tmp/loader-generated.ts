import express from 'express';
import { errorResponse } from '../functions';

export const router = express.Router();

// here we import all the routes
// tslint:disable
import { requestHandler as name162254080402517019 } from '../offers/index';
router.use('/rest/po/partner/v1/partners/:partnerNumber/offers', name162254080402517019);
import { requestHandler as name162254080402550099 } from '../properties/index';
router.use('/rest/pds-document/v1/documents/properties', name162254080402550099);

router.use('/rest/pds-document/v1/documents', (req, res) => {
  res.json(
    {"__note":"this would be a PDF blob file"}
  );
  res.end();
});

router.use('/rest/po/document/v2/documents', (req, res) => {
  res.json(
    {"__note":"this would be a PDF blob file"}
  );
  res.end();
});

router.use('/', (req, res) => {
  errorResponse(res, 'no EP defined for given URL. Add it to url-schema.json');
  res.end();
});