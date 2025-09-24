import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Lottie from "lottie-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import loadingAnimation from "../assets/loading1.json";
import { authAPI, setAuthTokens } from "../api/axios"; 

//Validation schema
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoginError(""); 

      // Use the authAPI from your axios configuration
      const response = await authAPI.login(data);

      // Store both access and refresh tokens
      setAuthTokens(response.data.access, response.data.refresh);

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data) {
        // Handle specific error messages from backend
        const errorData = err.response.data;

        if (errorData.non_field_errors) {
          setLoginError(errorData.non_field_errors[0]);
        } else if (errorData.detail) {
          setLoginError(errorData.detail);
        } else {
          setLoginError("Invalid email or password");
        }
      } else {
        setLoginError("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-custom p-4">
      <div
        className="card shadow-lg rounded-4 p-4 w-100"
        style={{ maxWidth: "420px" }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        {/* Error message */}
        {loginError && (
          <div className="alert alert-danger" role="alert">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={`form-control rounded-pill ${
                errors.email ? "is-invalid" : ""
              }`}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={`form-control rounded-pill pe-5 ${
                  errors.password ? "is-invalid" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 text-secondary"
                style={{ border: "none", background: "transparent" }}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.message}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn w-100 rounded-pill py-2 fw-semibold shadow-sm border-0 d-flex justify-content-center align-items-center gap-2"
            style={{ backgroundColor: "#73c2be", color: "#fff" }}
          >
            {isSubmitting ? (
              <Lottie
                animationData={loadingAnimation}
                loop={true}
                style={{ width: "1.8rem", height: "1.8rem" }}
              />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Forgot Password */}
        <p className="mt-3 text-center">
          <Link
            to="/forgot-password"
            className="text-black text-decoration-none fw-medium hover:text-decoration-underline"
            style={{ transition: "color 0.1s ease" }}
          >
            Forgot your password?
          </Link>
        </p>

        {/* Register Redirect */}
        <p className="mt-2 text-center text-muted">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="fw-medium text-decoration-none text-black"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
