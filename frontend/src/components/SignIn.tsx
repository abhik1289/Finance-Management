import { Link } from 'react-router-dom';
import Button from '../components/common/Button';


function SignIn() {
  return (
     <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-xl shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
            Finance Management
          </p>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Sign in to your account
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Welcome back. Enter your credentials to continue.
          </p>
        </div>

        <form className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

         
          <Button type="submit" className="w-full">
            Sign In
          </Button>

          
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Don&apos;t have an account?{' '}
          <Link
            to="/sign-up"
            className="font-semibold text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            Create one
          </Link>
        </p>
      </section>
    </main>
  )
}

export default SignIn
