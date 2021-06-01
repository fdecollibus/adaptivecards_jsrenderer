// This helper function is taken from https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid

import { Response } from 'express';

export const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  // tslint:disable-next-line:one-variable-per-declaration no-bitwise triple-equals
  const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});

export const errorResponse = (res: Response, msg = 'not found', code = 404) => {
  res.set('content-type', 'application/json');
  res.status(code).send(
    JSON.stringify({
      error: msg,
    }),
  );
};
