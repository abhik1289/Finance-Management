import { Link } from 'react-router-dom'

export default function SignInPage() {
  return (
    <main>
      <h1>Sign In</h1>
      <p>Sign in to continue.</p>
      <nav>
        <Link to="/">Home</Link> | <Link to="/category">Category</Link> |{' '}
        <Link to="/expenses">Expenses</Link> | <Link to="/sign-in">Sign In</Link> |{' '}
        <Link to="/sign-up">Sign Up</Link>
      </nav>
    </main>
  )
}
