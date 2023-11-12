import { useEffect, useState, useCallback } from 'react'
import './App.css'
import Cookies from 'js-cookie'
import { useNavigate, useLoaderData, Form } from 'react-router-dom'
import Chatroom from './chatroom'

function App () {
  const token = Cookies.get('token')
  const navigate = useNavigate()
  const [chatlist, setChatlist] = useState([])
  const [isAddingFriend, setIsAddingFriend] = useState(false)
  const [newFriendEmail, setNewFriendEmail] = useState('')
  const [me, setMe] = useState('')
  const [chatroomTarget, setChatroomTarget] = useState('')
  const fetchDataWithJWT = useCallback(async () => {
    const response = await fetch('http://localhost:3000/api/friendlist', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
    // console.log(response)
    if (response.status === 401) { // unauth
      navigate('/login')
    } else {
      const { filteredEmails, me } = await response.json()
      setMe(me)
      setChatlist(filteredEmails)
    }
  }, [navigate, token])

  useEffect(() => {
    fetchDataWithJWT()
  }, [fetchDataWithJWT]) // it will infinity loop,so need useCallback

  // add friend part
  const handleAddFriendClick = () => {
    if (isAddingFriend) {
      setIsAddingFriend(false)
    } else {
      setIsAddingFriend(true)
    }
  }
  const handleFriendInputChange = (e) => {
    setNewFriendEmail(e.target.value)
  }
  const handleFriendSave = (e) => {
    const PostDataWithJWT = async () => {
      e.preventDefault()
      const formdata = new FormData(e.target)
      formdata.append('email', newFriendEmail)
      const response = await fetch('http://localhost:3000/api/friendlist', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formdata
      })
      console.log(response)
      if (response.status === 401) { // unauth
        console.log('401')
        navigate('/login')
      } else {
        const result = await response.json()
        console.log(result)
        // refresh and show the result
        fetchDataWithJWT()
        setNewFriendEmail('')
      }
    }
    PostDataWithJWT()
  }
  // chatroom part

  return (
    <>
      <div className='rootContainer'>
        <div className='chatList'>
          <div className='me'>{me}</div>
          <div>
            <button onClick={handleAddFriendClick}>Add friend</button>
            {isAddingFriend && (
              <form onSubmit={handleFriendSave}>
                <div>
                  <input
                    type='email'
                    placeholder="Friend's email"
                    value={newFriendEmail}
                    onChange={handleFriendInputChange}
                  />
                  <button type='submit'>save</button>
                </div>
              </form>
            )}
          </div>
          <div>
            {chatlist.map((value) => (
              <li key={value} onClick={(e) => setChatroomTarget(e.target.textContent)}>{value}</li>
            ))}
          </div>

        </div>
        <div className='chatroom'>
          <Chatroom target={chatroomTarget} me={me} />
        </div>

      </div>
    </>
  )
}

export default App
