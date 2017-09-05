#!/usr/bin/env node

const commander = require('commander');
const fs = require('fs');
const pkg = require('./package.json');
const getDirFiles = require('./lib/get-dir-files');
const errorHandler = require('./lib/error-handler');
const addErrorHandler = require('./lib/add-error-handler');
const processFileData = require('./lib/process-file-data');
const getFileKey = require('./lib/get-file-key');
const createOnAllWritten = require('./lib/on-all-written');

const onHelp = () =>
{
  console.log('    Examples:');
  console.log('');
  console.log('    $ wa-consul-kv-sync /home/wa/consul/config /home/wa/config/consul.json');
  console.log('');
  console.log('    $ wa-consul-kv-sync -h');
  console.log('');
  console.log('    $ wa-consul-kv-sync -V');
  console.log('');
};

commander.version(pkg.version)
  .usage('[config path]')
  .description('Synchronizes one or more JSON manifests with consul\'s key value store.')
  .on('--help', onHelp);

commander.parse(process.argv);

if (!commander.args.length || commander.args.length !== 2)
{
  commander.outputHelp();
  process.exit(1);
}

const configRoot = commander.args[0];
const output = commander.args[1];

const files = getDirFiles(configRoot, errorHandler);
let writes = 0;

const onComplete = () =>
{
  console.log('Complete. ' + files.length + ' files processed.');
  process.exit(0);
};

const createOnDataWritten = (file, filesLength, onAllWritten) => addErrorHandler(() =>
{
  writes++;
  console.log('"' + file + '" processed, ' + writes + ' of ' + filesLength);

  if (writes === filesLength)
  {
    onAllWritten();
  }
});

fs.writeFile(output, '{', 'utf8', addErrorHandler(() =>
{
  const onAllWritten = createOnAllWritten(output, onComplete);

  files.forEach(file =>
  {
    const onDataWritten = createOnDataWritten(file, files.length, onAllWritten);
    const onFileRead = processFileData(output, getFileKey(file, configRoot.length), onDataWritten);

    fs.readFile(file, 'utf8', onFileRead);
  });
}));

