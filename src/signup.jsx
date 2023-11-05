function Signup () {
  return (
    <>
      <p>signup</p>
      <form action='http://localhost:3000/signup' method='post'>
        <label htmlFor='email'>Email</label>
        <input type='email' name='email' />
        <label htmlFor='password'>Password</label>
        <input type='password' name='password' id='password' />
        <label htmlFor='passwordConfirm'>Password once again</label>
        <input type='passwordConfirm' name='passwordConfirm' id='passwordConfirm' />
        <input type='submit' value='create' />
      </form>
    </>
  )
}
export default Signup
