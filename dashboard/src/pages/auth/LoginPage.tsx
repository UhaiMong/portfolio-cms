import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import { login, clearError } from "../../src/features/auth/authSlice";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { loading, isAuthenticated } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  const [showPass, setShowPass] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await dispatch(login(data));
      if (login.fulfilled.match(res)) {
        (toast.success("Welcome to Portfolio Dashboard"),
          navigate("/dashboard", { replace: true }));
      }
    } catch (error) {
      const msg = (error as string) || "Login failed. Please try again.";
      setApiError(msg);
      toast.error(msg);
      dispatch(clearError());
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl mb-4">
              <Lock size={24} className="text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-gray-400 text-sm mt-1">
              Sign in to your portfolio CMS
            </p>
          </div>

          {/* API error banner */}
          {apiError && (
            <div className="flex items-start gap-2 bg-red-950/60 border border-red-700/50 text-red-300 text-sm rounded-lg px-4 py-3 mb-5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="admin@example.com"
                  onChange={() => setApiError(null)}
                  className={`w-full bg-gray-800 border rounded-lg pl-9 pr-4 py-2.5 text-sm text-white
                    placeholder-gray-500 outline-none transition-colors
                    ${
                      errors.email
                        ? "border-red-500 focus:border-red-400"
                        : "border-gray-700 focus:border-indigo-500"
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={showPass ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      onChange={(e) => {
                        setApiError(null);
                        field.onChange(e); // keep RHF in sync
                      }}
                      className={`w-full bg-gray-800 border rounded-lg pl-9 pr-10 py-2.5 text-sm text-white
                    placeholder-gray-500 outline-none transition-colors
                    ${
                      errors.password
                        ? "border-red-500 focus:border-red-400"
                        : "border-gray-700 focus:border-indigo-500"
                    }`}
                    />
                  )}
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800
                disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg
                transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            Portfolio CMS — Admin Panel Only
          </p>
        </div>
      </div>
    </div>
  );
}
