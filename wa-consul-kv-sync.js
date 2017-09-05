#!/usr/bin/env node

const commander = require('commander');
const fs = require('fs');
const pkg = require('./package.json');
const getDirFiles = require('./lib/get-dir-files');
const errorHandler = require('./lib/error-handler');
const addErrorHandler = require('./lib/add-error-handler');
const displayHelp = require('./lib/display-help');
const getFileKeys = require('./lib/get-file-keys');

commander
  .version(pkg.version)
  .option('--json-root [value]', 'configuration JSON root node ("Configurations" by default)')
  .usage('[options] [path-to-config-root] [path-to-output-file]')
  .description('Merges JSON manifests for consul\'s key value store.')
  .on('--help', displayHelp);

commander.parse(process.argv);

if (!commander.args.length || commander.args.length !== 2)
{
  commander.outputHelp();
  process.exit(1);
}

const jsonRoot = commander.jsonRoot || 'Configurations';
const configRoot = commander.args[0];
const output = commander.args[1];

const json = {};

json[jsonRoot] = {};

const files = getDirFiles(configRoot, errorHandler);
let writes = 0;

const onComplete = () =>
{
  console.log('Complete. ' + files.length + ' files processed.');
  process.exit(0);
};

const addFileValue = (file, prefixLength, rootNs) =>
{
  fs.readFile(file, 'utf8', addErrorHandler(data =>
  {
    const keys = getFileKeys(file, prefixLength);
    const lastKey = keys.pop();

    let prevNs = rootNs;

    keys.forEach(key =>
    {
      prevNs[key] = prevNs[key] || {};
      prevNs = prevNs[key];
    });

    try
    {
      prevNs[lastKey] = JSON.parse(data);
    }
    catch (err)
    {
      prevNs[lastKey] = data;
    }

    writes++;
    console.log('"' + file + '" processed, ' + writes + ' of ' + files.length);

    if (writes === files.length)
    {
      fs.writeFile(output, JSON.stringify(json), 'utf8', addErrorHandler(onComplete));
    }
  }));
};

files.forEach(file =>
{
  addFileValue(file, configRoot.length + 1, json[jsonRoot]);
});

