import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; 
import api from "../api/axios";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await api.post(`/auth/password/reset/confirm/${uid}/${token}/`, {
        password: data.password,
      });
      alert("Password reset successful. You can now login.");
      navigate("/login");
    } catch (err) {
      alert("Error resetting password. The link may have expired.");
    }
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center bg-custom p-3">
      <div
        className="card shadow-lg rounded-4 p-4 w-100"
        style={{ maxWidth: "420px" }}
      >
        <h3 className="text-center mb-4 text-gray-800 fw-bold">
          Reset Password
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* New Password */}
          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
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
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
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
            className="btn w-100 rounded-pill py-2 fw-semibold shadow-sm border-0"
            style={{ backgroundColor: "#73c2be", color: "#fff" }}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
