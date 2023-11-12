import io from 'socket.io-client'
export const createSocket = () => {
  const socket = io('http://localhost:3000', {
    'force new connection': true,
    reconnectionAttempts: 'Infinity',
    timeout: 10000,
    transports: ['websocket'],
    withCredentials: true,
    autoConnect: false
  })
  return socket
}
