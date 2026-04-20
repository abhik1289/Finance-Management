import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <main>
      <h1>Home</h1>
      <p>Welcome to your finance app.</p>
      <nav>
        <Link to="/">Home</Link> | <Link to="/category">Category</Link> |{' '}
        <Link to="/expenses">Expenses</Link> | <Link to="/sign-in">Sign In</Link> |{' '}
        <Link to="/sign-up">Sign Up</Link>
      </nav>
    </main>
  )
}
