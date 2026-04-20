import { Link } from 'react-router-dom'

export default function SignUpPage() {
  return (
    <main>
      <h1>Sign Up</h1>
      <p>Create your account.</p>
      <nav>
        <Link to="/">Home</Link> | <Link to="/category">Category</Link> |{' '}
        <Link to="/expenses">Expenses</Link> | <Link to="/sign-in">Sign In</Link> |{' '}
        <Link to="/sign-up">Sign Up</Link>
      </nav>
    </main>
  )
}
