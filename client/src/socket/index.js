import openSocket from 'socket.io-client';
const socket = openSocket(`http://localhost:${process.env.REACT_APP_SOCKET_PORT}`);

export default socket;
