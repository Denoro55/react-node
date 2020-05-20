import openSocket from 'socket.io-client';
const socket = openSocket(window.location.host);

export default socket;
