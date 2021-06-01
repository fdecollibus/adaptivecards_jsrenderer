import express, { RequestHandler } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import compress from 'compression';
import bodyParser from 'body-parser';
// Import all modules
// @ts-ignore avoid 'cannot find module' error with npm run build script (for production)
import { router as rest } from './.tmp/loader-generated';

// Create a new express app instance
const app = express();

const getActualRequestDurationInMilliseconds = (start: [number, number]) => {
  const NS_PER_SEC = 1e9; // convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const addLeadingZero = (numberToConvert: number): string => numberToConvert < 10 ? ('0' + numberToConvert) : ('' + numberToConvert);

// custom middleware to track requests
const requestLogger: RequestHandler = (req, res, next) => {
  const currentDatetime = new Date();
  const formattedDate = `${currentDatetime.getFullYear()}-${(addLeadingZero(currentDatetime.getMonth() + 1))}-${addLeadingZero(currentDatetime.getDate())} ${addLeadingZero(currentDatetime.getHours())}:${addLeadingZero(currentDatetime.getMinutes())}:${addLeadingZero(currentDatetime.getSeconds())}`;
  const start = process.hrtime();

  next(); // run other middlewares

  const method = req.method;
  const url = req.originalUrl; // https://expressjs.com/en/4x/api.html#req.originalUrl
  const status = res.statusCode;
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);

  if (status > 300) {
    console.log('params', req.params);
  }

  let log = `${chalk.cyan(`[${formattedDate}]`)} ${chalk.yellow(method)} ${chalk.green(`${url} ${status} ${chalk.cyan(`${durationInMilliseconds.toLocaleString()} ms`)}`)}`;
  if (![200, 204, 304].includes(status)) {
    log = `${chalk.red(`[${formattedDate}] ${method} ${url} ${status} ${durationInMilliseconds} ms`)}`;
  }

  // tslint:disable-next-line:no-console
  console.log(log);
};

app.use(requestLogger);

// Simulate GZIP response to emulate server as close as possible
app.use(compress());

// get raw body data
app.use(bodyParser.text(
  {
    type: ['text', 'json'],
  },
));

// Enable CORS to all domains (Accept from *)
app.use(cors());

// Init main API entry point
app.use('/', rest);

// Create empty args object to be filled later on for easier args access
const args: any = {};
// access process args TODO: use maybe contains instead of filter
process.argv
  .slice(2)
  // tslint:disable-next-line:no-bitwise
  .filter(arg => ~arg.indexOf('='))
  .forEach((arg) => {
    const {0: key, 1: value} = arg.split('=');
    args[key] = value;
  });

// Defined PORT based on args passed
const port = args.port ? args.port : 8080;

// Open the port and listen to it
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`API is listening on port ${port}!`);
});

// TODO: add middleware for tracking all requests incomes
