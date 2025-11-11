import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Lottie from "lottie-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; 
import loadingAnimation from "../assets/loading1.json";
import api from "../api/axios";

// Validation schema with zod
const registerSchema = z
  .object({
    first_name: z.string().min(2, "First name is required"),
    last_name: z.string().min(2, "Last name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...payload } = data;
      await api.post("/auth/register/", payload);
      navigate("/login");
    } catch (err) {
      alert("Registration failed. Try again.");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-custom p-4">
      <div
        className="card shadow-lg rounded-4 p-4 w-100"
        style={{ maxWidth: "460px" }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              placeholder="kevin"
              {...register("first_name")}
              className={`form-control rounded-pill ${
                errors.first_name ? "is-invalid" : ""
              }`}
            />
            {errors.first_name && (
              <div className="invalid-feedback">
                {errors.first_name.message}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              placeholder="obote"
              {...register("last_name")}
              className={`form-control rounded-pill ${
                errors.last_name ? "is-invalid" : ""
              }`}
            />
            {errors.last_name && (
              <div className="invalid-feedback">{errors.last_name.message}</div>
            )}
          </div>

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
          <div className="mb-3 position-relative">
            <label className="form-label">Password</label>
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
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-3 position-relative">
            <label className="form-label">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`form-control rounded-pill pe-5 ${
                errors.confirmPassword ? "is-invalid" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 text-secondary"
              style={{ border: "none", background: "transparent" }}
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
            {errors.confirmPassword && (
              <div className="invalid-feedback">
                {errors.confirmPassword.message}
              </div>
            )}
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
              "Sign Up"
            )}
          </button>
        </form>

        {/* Already have account */}
        <p className="mt-4 text-center text-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="fw-medium text-decoration-none text-black"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
