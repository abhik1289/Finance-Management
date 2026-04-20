import { Link } from 'react-router-dom'

export default function ExpensesPage() {
  return (
    <main>
      <h1>Expenses</h1>
      <p>Track and review your expenses here.</p>
      <nav>
        <Link to="/">Home</Link> | <Link to="/category">Category</Link> |{' '}
        <Link to="/expenses">Expenses</Link> | <Link to="/sign-in">Sign In</Link> |{' '}
        <Link to="/sign-up">Sign Up</Link>
      </nav>
    </main>
  )
}
