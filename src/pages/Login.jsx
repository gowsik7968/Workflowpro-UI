import { useState } from "react"  
import { useNavigate, Link } from "react-router-dom"  
import { loginUser } from "../services/api"  

function Login() {
  const navigate = useNavigate()  
  const [formData, setFormData] = useState({ email: "", password: "" })  
  const [showPassword, setShowPassword] = useState(false)  
  const [loading, setLoading] = useState(false)  
  const [message, setMessage] = useState("")  
  const [error, setError] = useState("")  

  function handleChange(e) {
    const { name, value } = e.target  
    setFormData((prev) => ({...prev,[name]: value}))  
  }
  async function handleSubmit(e) {
    e.preventDefault()  
    setMessage("")  
    setError("")  
    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.")  
      return  
    }
    try {
      setLoading(true)  
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      })  
      setMessage(response.message || "Login successfully!")  
      // Example: navigate to dashboard after login
      navigate("/dashboard")  
    } catch (err) {
      setError(err.message || "Something went wrong.")  
    } finally {
      setLoading(false)  
    }
    const handleLogin = async (e) => {
  e.preventDefault()  
  setLoading(true)  
  setError("")  
  setSuccess("")  
  try {
    const response = await loginUser({
      email,
      password,
    })  
    setSuccess(response.message || "Login successful!")  
    // JWT is already saved by loginUser().
    // Dashboard navigation will be added next.
  } catch (error) {
    setError(
      error.response?.data?.message ||
      "Login failed. Please check your credentials."
    )  
  } finally {
    setLoading(false)  
  }
}  
  }
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand">
          <h1>WorkFlowPro</h1>
          <p>Manage projects. Empower teams.</p>
        </div>
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <h2>Welcome Back</h2>
            <p className="login-subtitle">
              Sign in to continue to your workspace
            </p>
            {message && (
              <div className="login-alert success-alert">{message}</div>
            )}
            {error && <div className="login-alert error-alert">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="login-form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="login-form-group">
                <label htmlFor="password">Password</label>
                <div className="login-password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    className="login-password-toggle"
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="login-register">
              Don’t have an account?{" "}
              <Link to="/register">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )  
}

export default Login  
