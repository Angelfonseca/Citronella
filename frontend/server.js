const serve = require('serve');

const server = serve('dist/spa', {
  port: 8081,
  ignore: ['node_modules']
});

console.log('Serving on http://localhost:8081');
