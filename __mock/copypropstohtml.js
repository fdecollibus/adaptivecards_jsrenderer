const fs = require('fs');
const path = require('path');

const copyPropsToHtml = (base_path = '.') => {
  const pathIndexHtml = path.join(base_path, 'index.html');
  const pathPodProps = path.join(base_path, 'podproperties.json');
  const pathPackageJson = path.join(base_path, 'package.json');
  const pathIndexHtmlResolved = path.resolve(pathIndexHtml);

  const indexHtmlContent = fs.readFileSync(pathIndexHtmlResolved, 'utf8');
  const podPropsContent = fs.readFileSync(path.resolve(pathPodProps), 'utf8');
  const podPackageJsonContent = fs.readFileSync(path.resolve(pathPackageJson), 'utf8');
  let podPropsContentParsed = '';
  let podPackageJsonParsed = '';
  let newArticleElementString = ''; // this string is inserted in index.html at the end
  const articleStartIndex = indexHtmlContent.indexOf("<article");
  const articleEndIndex = indexHtmlContent.indexOf("</article>") + "</article>".length;
  const articleElement = indexHtmlContent.substring(articleStartIndex, articleEndIndex);

  // get all the attributes which are not pod properties
  const attrClass = articleElement.match(/class=".*?"/);
  const attrLang = articleElement.match(/data-language=".*?"/);
  const attrStage = articleElement.match(/data-stage=".*?"/);

  attrClass ? newArticleElementString += `\n      ${attrClass}` : '';
  attrLang ? newArticleElementString += `\n      ${attrLang}` : '';
  attrStage ? newArticleElementString += `\n      ${attrStage}` : '';

  try {
    podPropsContentParsed = JSON.parse(podPropsContent);
    podPackageJsonParsed = JSON.parse(podPackageJsonContent);
  } catch (e) {
    console.log(e);
  }

  const propertyNamesArray = Object.keys(podPropsContentParsed);

  propertyNamesArray.forEach(propName => {

    if (propName === 'apiBaseUrl') {
      podPropsContentParsed[propName].localhost = 'http://localhost:8081';
    }

    const propValue = podPropsContentParsed[propName];
    let propValueString = '';

    if (typeof propValue === 'string') {
      propValueString = propValue
    } else {
      // We can not implement same logic of props mapper like at midgard code, because we are not running on any stage. So just take dev or de values of an object.
      const fakeStageAndLanguageMapper = podPropsContentParsed[propName].localhost || podPropsContentParsed[propName].dev || podPropsContentParsed[propName].de;

      if (fakeStageAndLanguageMapper) {
        propValueString = fakeStageAndLanguageMapper;
      } else {
        propValueString = JSON.stringify(podPropsContentParsed[propName]);
      }
    }

    propValueString = propValueString.replace(/"/g, "&quot;");
    newArticleElementString += `\n      data-${propName}="${propValueString}"`;
  });

  newArticleElementString += `\n      data-podversion="${podPackageJsonParsed['version']}"`;
  newArticleElementString = `<article${newArticleElementString}>\n    </article>`;
  fs.writeFileSync(pathIndexHtmlResolved, indexHtmlContent.replace(articleElement, newArticleElementString));
};

module.exports = {
  copyPropsToHtml,
};
