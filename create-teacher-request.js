const http = require('http');

const payload = JSON.stringify({
  fullName: 'Teacher One',
  email: 'teacherone@example.com',
  username: 'teacherone',
  password: 'teacher123',
  role: 'teacher'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/users/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(res.statusCode);
    console.log(data);
  });
});

req.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

req.write(payload);
req.end();
