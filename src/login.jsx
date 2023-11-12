import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
function Login () {
  const navigate = useNavigate()

  async function loginPost (e) {
    e.preventDefault()

    const formData = new FormData(e.target)

    try {
      const fetchLoginPost = await fetch('http://localhost:3000/login', {
        method: 'POST',
        body: formData

      })
      const data = await fetchLoginPost.json()
      if (data.status) {
        console.log(data.message)
        console.log(data.email)
        Cookies.set('token', data.token)
        navigate('/app')
      } else {
        console.log(data.message)
        navigate('/login')
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <div />
      <p>login</p>
      <form onSubmit={(e) => loginPost(e)}>
        <label htmlFor='email'>Email</label>
        <input type='email' name='email' id='email' />
        <label htmlFor='password'>Password</label>
        <input type='password' name='password' id='password' />
        <button type='submit'>login</button>
      </form>
    </>
  )
}
export default Login
