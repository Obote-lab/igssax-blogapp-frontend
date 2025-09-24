import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import api from "../api/axios";

// Validation schema
const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setSuccess("");
    setError("");
    try {
      await api.post("/auth/password/reset/", data);
      setSuccess("Check your email for password reset instructions.");
    } catch (err) {
      setError("Could not send reset email. Please try again.");
    }
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center bg-custom p-3">
      <div
        className="card shadow-lg rounded-4 p-4 w-100"
        style={{ maxWidth: "440px" }}
      >
        <h3 className="text-center mb-3 text-gray-800 fw-bold">
          Forgot Password
        </h3>
        <p className="text-muted text-center mb-4">
          Enter your email and we’ll send you a reset link.
        </p>

        {success && <p className="text-success text-center">{success}</p>}
        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Email */}
          <div className="mb-3">
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn w-100 rounded-pill py-2 fw-semibold shadow-sm border-0"
            style={{ backgroundColor: "#73c2be", color: "#fff" }}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
