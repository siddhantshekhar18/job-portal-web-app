import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter both email and password");

      return;
    }

    setLoading(true);

    try {
      await login(formData.email.trim(), formData.password);

      navigate(from, { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-700"
            >
              Email address
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 transition hover:text-blue-500"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
