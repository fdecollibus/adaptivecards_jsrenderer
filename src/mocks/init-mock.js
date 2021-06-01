const outdent = require('outdent');
const fs = require('fs');
const {sep} = require('path');
const {cwd} = process;

// this settings are where the real mocks are
const PATH_TO_MOCKS = 'src/mocks';
const SCHEMA_NAME = 'url-schema.json';

// this settings is where the actual node server is started
const MOCK_INIT = `src${sep}mocks${sep}.tmp`;

const generateUniqueNumber = () => Date.now() + ((Math.random() * 100000).toFixed());

const appendFilesToLoaderData = (key, value, mockImports = []) => {
  // we only want t fix json as repsonse
  if (~value.indexOf('.json')) {
    const data = require(`${cwd()}/${PATH_TO_MOCKS}/${value.replace('./', '')}`);
    mockImports.push(outdent`

      router.use('${key}', (req, res) => {
        res.json(
          ${JSON.stringify(data)}
        );
        res.end();
      });
    `);

    // we want typescript and control the response ourself
  } else {
    const uniqueNumber = `name${generateUniqueNumber()}`;
    mockImports.push(outdent`
      import { requestHandler as ${uniqueNumber} } from '../${value}';
      router.use('${key}', ${uniqueNumber});
    `);
  }
};

// use require so we are able to directly import and convert JSON to object
const {rest, ...others} = require(`${cwd()}/${PATH_TO_MOCKS}/${SCHEMA_NAME}`);

// get all the templates files
const loaderData = fs.readFileSync(`${__dirname}${sep}templates${sep}loader-template.ts`, 'utf8').toString();

const mockImports = [];
if (rest) {
  for (const [key, value] of Object.entries(rest)) {
    appendFilesToLoaderData(`/rest${key}`, value.replace('.ts', ''), mockImports);
  }
}

for (const [key, value] of Object.entries(others)) {
  appendFilesToLoaderData(key, value.replace('.ts', ''), mockImports);
}

const loaderReadyData = loaderData.replace(new RegExp('/\\*___REPLACE_HERE___\\*/', 'g'), mockImports.join('\n'));

const loaderDir = `${cwd()}${sep}${MOCK_INIT}`;
if (!fs.existsSync(loaderDir)) {
  fs.mkdirSync(loaderDir);
}

// write loader data to server folder
fs.writeFileSync(
  `${loaderDir}${sep}loader-generated.ts`,
  loaderReadyData,
  'utf8'
);

