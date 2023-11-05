import { useEffect } from 'react'
import './App.css'
import Cookies from 'js-cookie'

function App () {
  const token = Cookies.get('token')
  useEffect(() => {
    const fetchDataWithJWT = async () => {
      const response = await fetch('http://localhost:3000/test', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
      const result = await response.json()
      console.log(result)
    }
    fetchDataWithJWT()
  }, [token])
  return (
    <>
      <div className='rootContainer'>
        <div className='chatList'>chatLIst</div>
        <div className='chatroom'>chatroom</div>
      </div>
    </>
  )
}

export default App
