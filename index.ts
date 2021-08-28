import * as http from 'http';
import * as p from 'path';
import * as fs from 'fs';

const server = http.createServer();
let pathDir = p.resolve(__dirname, 'public');
server.on('request', (request, response) => {
  let url = request.url;
  let path = p.resolve(pathDir, url.slice(1));
  if (url === '/') {
    path = p.resolve(pathDir, 'index.html');
  }
  fs.readFile(path, (error, data) => {
    if (error) {
      if (error.errno === -4068) {
        response.statusCode = 403;
        response.setHeader('Content-Type','text/ plain;charset=utf-8');
        response.write('么有权限查看目录');
        response.end();
      } else if (error.errno === -4058) {
        fs.readFile(p.resolve(pathDir, '404.html'), (error, data) => {
          if (error) throw error;
          response.statusCode = 404
          response.end(data);
        });
      }else {
        response.statusCode = 500
        response.setHeader('Content-Type','text/ plain;charset=utf-8');
        response.end('服务器繁忙，请稍后再试')
      }
    } else {
      response.statusCode = 200;
      response.end(data)
    }
  });
});
server.listen(8888);