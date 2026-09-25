import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
const rows=JSON.parse(readFileSync('dist/samples/catalog.json'));
for(const row of rows){const file=readFileSync('dist/'+row.file);assert.equal(createHash('sha256').update(file).digest('hex'),row.sha256);assert.equal(file.length,row.bytes);assert.ok(readFileSync('dist/'+row.launch).length>0)}
console.log('Both original SCORM sample archives match their recorded SHA-256 hashes.');
