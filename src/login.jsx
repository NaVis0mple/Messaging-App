import Cookies from 'js-cookie'
function Login () {
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
        Cookies.set('token', data.token)
      } else {
        console.log(data.message)
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
