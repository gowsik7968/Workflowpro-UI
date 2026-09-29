
import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/api";


function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!fullName || !email || !password || !formData.confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8 || password.length > 72) {
      setError("Password must be between 8 and 72 characters.");
      return;
    }

    if (password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({
        fullName,
        email,
        password,
      });

      setMessage(
        `Registration successful! Welcome, ${result.fullName}.`
      );

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left branding section */}
        <div className="register-brand">
          <div className="brand-logo">
            <span className="brand-logo-icon">W</span>
            <span>WorkFlowPro</span>
          </div>

          <div className="brand-content">
            <span className="brand-tag">WORK SMARTER</span>

            <h1>
              Bring your team
              <br />
              together.
            </h1>

            <p>
              Plan projects, manage tasks, and collaborate
              with your team in one powerful workspace.
            </p>

            <div className="brand-features">
              <div className="brand-feature">
                <span className="feature-check">✓</span>
                Organize projects effortlessly
              </div>

              <div className="brand-feature">
                <span className="feature-check">✓</span>
                Collaborate with your team
              </div>

              <div className="brand-feature">
                <span className="feature-check">✓</span>
                Team progress in real time
              </div>
            </div>
          </div>

          <div className="brand-footer">
            Your work. Your team. One workspace.
          </div>
        </div>

        {/* Registration form section */}
        <div className="register-form-section">
          <div className="register-form-wrapper">
            <div className="mobile-brand">
              <span className="brand-logo-icon">W</span>
              <span>WorkFlowPro</span>
            </div>

            <div className="register-heading">
              <span className="form-eyebrow">
                GET STARTED FOR FREE
              </span>

              <h2>Create your account</h2>
              <p>Enter your details to join WorkFlowPro.</p>
            </div>

            {message && (
              <div
                className="form-alert success-alert"
                role="status"
              >
                ✓ {message}
              </div>
            )}

            {error && (
              <div className="form-alert error-alert" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>

                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  maxLength={100}
                  autoComplete="name"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email</label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Password</label>

                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                    maxLength={72}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <small className="input-hint">
                  Use 8–72 characters.
                </small>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <div className="password-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength={8}
                    maxLength={72}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account →"}
              </button>
            </form>

            <div className="register-login">
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
            </div>

            <p className="register-terms">
              By creating an account, you agree to use
              WorkFlowPro responsibly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;