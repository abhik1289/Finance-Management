import { Link } from 'react-router-dom'

export default function CategoryPage() {
  return (
    <main>
      <h1>Category</h1>
      <p>Manage your expense categories here.</p>
      <nav>
        <Link to="/">Home</Link> | <Link to="/category">Category</Link> |{' '}
        <Link to="/expenses">Expenses</Link> | <Link to="/sign-in">Sign In</Link> |{' '}
        <Link to="/sign-up">Sign Up</Link>
      </nav>
    </main>
  )
}
