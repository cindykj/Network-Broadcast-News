const net = require('net');
const PORT = 6969;
const HOST = '0.0.0.0';
let connectionCount = [];


const server = net.createServer(function (socket) {
  console.log('Client connected!');
  socket.setEncoding('utf8');
  process.stdin.pipe(socket); //pipe from server to socket
  socket.username = undefined; // make property on socket object

  if (socket.username === undefined) {
    socket.write('Welcome, Client!\r\n Please enter your username: '); //carriage return, linefeed (a la typewriter)
  };

  socket.on('data', (data) => {
    // if new user name, please set
    if (!socket.username) {
      let username = socket.username;
      username = data.trim();
      socket.write(`Welcome back, ${username}! \r\n`);
      socket.write(`${username} just logged in.`)
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


server.on('error', (err) => {
  throw err;
});

// Listens for connections on port 6969
server.listen(PORT, HOST, () => {
  console.log('Server listening on');
}); // closing for server.listen


// admin log in
// if (!data.trim().includes('admin')) {
  // } else {
    //   socket.write('Username cannot contain admin. Please try again.\r\n Please enter your username: ');
    // }

//this pipes back to itself as echo (i.e. sanity check)
    // socket.pipe(socket); 