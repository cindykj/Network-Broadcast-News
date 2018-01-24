const net = require('net');
const PORT = 6969;
const HOST = '0.0.0.0';
let connectionCount = [];


const server = net.createServer(function (socket) {
  console.log('Client connected!');
  socket.setEncoding('utf8');
  process.stdin.pipe(socket); //pipe from server to socket
  socket.username = null; // make property on socket object
  console.log(connectionCount);

  socket.write('Welcome, Client!\r\n Please enter your username: '); //carriage return, linefeed (a la typewriter)

  socket.on('data', (data) => {
    // console.log(data);
    // if new user name, please set
    if (socket.username === null) {
      let username = socket.username;
      if (!data.trim().includes('admin')) {
        username = data.trim();
        socket.write(`Welcome back, ${username}! \r\n`);
        console.log(`${username} just logged in.`)
      } else {
        socket.write('Username cannot contain admin. Please try again.\r\n Please enter your username: ');
      }
      // console.log(connectionCount); 
    } else {
      connectionCount
        .filter(element => {
          return element !== socket; // filters whether incoming is true connection
        })
        .forEach(element => {
          element.write(`${username}, ${data}`) // this writes msg to other connected clients
        })
    };
  });

  connectionCount.push(socket); //counts number of listeners

  //function to end connection
  socket.on('end', () => {
    //cleanup to remove the disconnected socket
    connectionCount.splice(connectionCount.indexOf(socket), 1)
    console.log('Client disconnected');
  }); //closing for socket.on(end)

}); // closing server connect

// socket.pipe(socket); //this pipes back to itself as echo (i.e. sanity check)
// socket.end(); //this ends connection from server side

// 
server.on('error', (err) => {
  throw err;
});

// Listens for connections on port 6969
server.listen(PORT, () => {
  console.log('Server listening on');
}); // closing for server.listen