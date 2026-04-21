import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { loginUser } from "../api/authApi";
import Button from "../components/common/Button";

type ErrorResponse = {
  message?: string;
  error?: string;
};

function SignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (serverError) {
      setServerError("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await loginUser(formData);
      if (response?.token) {
        localStorage.setItem("authToken", response.token);
      }

      localStorage.setItem(
        "authUser",
        JSON.stringify({
          email: response?.email ?? formData.email,
          fullName: response?.fullName ?? "",
        })
      );

      navigate("/profile");
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setServerError(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="name@example.com"
              required
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
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Don&apos;t have an account?{" "}
          <Link
            to="/sign-up"
            className="font-semibold text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}

export default SignIn;
