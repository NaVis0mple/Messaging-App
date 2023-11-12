import { useEffect, useCallback, useState, useRef } from 'react'
import Cookies from 'js-cookie'
import './chatroom.css'
import { useNavigate } from 'react-router-dom'
import { createSocket } from './socket'

function Chatroom ({ target, me }) {
  const navigate = useNavigate()
  const token = Cookies.get('token')
  const [messagesPrint, setMessagesPrint] = useState([])
  const [message, setMessage] = useState('')
  const [connect, setConnect] = useState(false)

  const [fetchReminder, setFetchReminder] = useState(false)

  const socket = useRef(null)
  // fetchMessage function
  const fetchChatMessage = useCallback(async () => {
    const response = await fetch(`http://localhost:3000/api/message?target=${target}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.status === 401) { // unauth
      console.log('401')
      navigate('/login')
    } else {
      const result = await response.json()
      setMessagesPrint(result)
    }
  }, [navigate, target, token])

  // first fetch
  useEffect(() => {
    fetchChatMessage()
  }, [fetchChatMessage])

  // if server socket send true when receive message
  useEffect(() => {
    if (fetchReminder) {
      fetchChatMessage()
      setFetchReminder(false)
    }
  }, [fetchChatMessage, fetchReminder])
  // socket setting
  useEffect(() => {
    // setConnect(false)
    socket.current = createSocket()
    socket.current.connect()

    //
    socket.current.on('connect', () => {
      socket.current.emit('connectMessage', { connectEmail: me, socketId: socket.current.id, targetEmail: target })
      console.log(`${target}chatroom connect : ${socket.current.id}`)
    })

    socket.current.on('newMessageNeedRefetchReminder', (data) => {
      if (data === true) {
        setFetchReminder(true)
      }
    })

    socket.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })
    // tester
    socket.current.on('backtoclient', (msg) => {
      console.log(msg)
    })

    return () => {
      // Cleanup the socket connection when the component is unmounted
      socket.current.off('connect')
      socket.current.disconnect()
      socket.current = null
    }
  }, [target, me])

  // message input part
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formdata = new FormData(e.target.form)
    formdata.append('chatTarget', target)
    try {
      const chatInputPost = await fetch('http://localhost:3000/api/message', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formdata
      })
      if (chatInputPost.status === 401) { // unauth
        console.log('401')
        navigate('/login')
      } else {
        const result = await chatInputPost.json()
        console.log(result)
        const senderIdEmail = result.senderID.email
        const receiverIdEmail = result.receiverID.email
        setMessage('')

        socket.current.emit('refetchReminderTarget', { connectEmail: me, socketId: socket.current.id, targetEmail: target })
      }
    } catch (error) {

    }
  }

  const handleKeyDown = (e) => { // enter listener
    if (e.keyCode === 13) {
      handleSubmit(e)
    }
  }

  return (
    <div className='chatDisplay'>
      <div>chat with {target}</div>
      <div className='listPart'>
        {messagesPrint.map((mes) =>
          (
            <li key={mes.timestamp}>
              {mes.message}
            </li>
          )
        )}
      </div>
      <div className='chatInput'>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder={`chat to ${target}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            name='message'
          />
        </form>
      </div>
      <div>{connect.toString()}</div>
    </div>

  )
}
export default Chatroom
