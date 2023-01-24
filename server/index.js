const { createServer } = require('node:http');
const { createReadStream } = require('node:fs');
const { setTimeout } = require('node:timers/promises');
const { Transform, Readable } = require('node:stream');
const { TransformStream, WritableStream } = require('node:stream/web');
const csvtojson = require('csvtojson');

const PORT = 3000;
// curl -N localhost:3000
createServer(async (request, response) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
  };
  if (request.method === 'OPTIONS') {
    response.writeHead(204, headers);
    response.end();
    return;
  }

  let items = 0;
  request.once('close', () => console.log('connection was closed!', items));

  // const d = (await r.getReader().read()).value
  // console.log('d', Buffer.from(d).toString('utf8'))
  Readable.toWeb(createReadStream('./netflix.csv'))
    .pipeThrough(Transform.toWeb(csvtojson()))
    .pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          const d = JSON.parse(Buffer.from(chunk));
          controller.enqueue(
            JSON.stringify({
              title: d.title,
              description: d.description,
            }).concat('\n'),
          );
        },
      }),
    )
    .pipeTo(
      new WritableStream({
        async write(chunk) {
          // await setTimeout(200);
          items++;
          response.write(chunk);
        },
        close() {
          response.end();
        },
      }),
    );

  response.writeHead(200, headers);
})
  .listen(PORT)
  .on('listening', _ => console.log('server running at ', PORT));
