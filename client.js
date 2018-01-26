const net = require('net');
const PORT = 6969;
const HOST = '0.0.0.0';

const client = net.createConnection(PORT, HOST, () => { //creating new socket as init
  console.log('Connected to server!');
  client.setEncoding('utf8');
  // write to server
  process.stdin.pipe(client);

  client.on('data', (data) => {
    process.stdout.write(data); //as soon as you get data from server, then console.log
  }); //closing for client.on data
  
}); //closing for createConnection


// to end connection
client.on('end', () => {
  console.log('disconnected from server');
}); // closing for client.on end

