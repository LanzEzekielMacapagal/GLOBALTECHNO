const http = require('http');
const boundary = '----Boundary' + Date.now();
const payload = [
  '--' + boundary,
  'Content-Disposition: form-data; name="title"',
  '',
  'Test Assignment',
  '--' + boundary,
  'Content-Disposition: form-data; name="instructions"',
  '',
  'Test instructions',
  '--' + boundary,
  'Content-Disposition: form-data; name="dueDate"',
  '',
  '2026-07-20T10:00:00.000Z',
  '--' + boundary + '--',
  ''
].join('\r\n');
const req = http.request({ host: '127.0.0.1', port: 3000, path: '/courses/test-course/assignments', method: 'POST', headers: { 'Content-Type': 'multipart/form-data; boundary=' + boundary, 'Content-Length': Buffer.byteLength(payload) } }, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log(data);
  });
});
req.on('error', (err) => { console.error(err); process.exit(1); });
req.write(payload);
req.end();
