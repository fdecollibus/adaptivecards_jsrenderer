import { RequestHandler } from 'express';

/**
 * Produces a request handler that returns json data. Behavior is affected by UserMocks:
 *
 * If a matching userMock is found (according to getFindUserMockOptions), and has a corresponding apiMock (according to getApiMock),
 * then either its requestHandler is called, or the data is filtered by its dataFilter.
 *
 * Use this as a default request handler when no other logic is necessary (example src/mocks/rest/pension-information/index.ts).
 */
export const makeRequestHandler = <T extends object, K extends T>(
  data: K,
): RequestHandler => (req, res) => {

  const responseSendJsonData = (jsonData: object | null) => {
    res.json(jsonData);
    res.end();
  };

  responseSendJsonData(data);
};
