import "./UserForgotPassword.css";
import { FaLock, FaEnvelope, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

function UserForgotPassword() {
    return (
        <div className="uforgot-container">

            {/* Left Panel */}

            <div className="uforgot-left-panel">

                <div className="uforgot-icon-box">
                    <FaLock />
                </div>

                <h1>
                    Reset
                    <br />
                    Password
                </h1>

                <div className="uforgot-divider"></div>

                <p className="uforgot-description">
                    Forgot your password? No worries. Enter your registered
                    email address and we'll help you reset your password
                    securely.
                </p>

                <div className="uforgot-feature-card">

                    <FaCheck />

                    <div className="uforgot-feature-content">

                        <h3>Secure Recovery</h3>

                        <p>
                            Your account is protected with secure
                            password recovery.
                        </p>

                    </div>

                </div>

                <div className="uforgot-feature-card">

                    <FaCheck />

                    <div className="uforgot-feature-content">

                        <h3>Email Verification</h3>

                        <p>
                            Receive a password reset link
                            instantly in your inbox.
                        </p>

                    </div>

                </div>

                <div className="uforgot-feature-card">

                    <FaCheck />

                    <div className="uforgot-feature-content">

                        <h3>Quick Access</h3>

                        <p>
                            Create a new password and
                            continue your job search.
                        </p>

                    </div>

                </div>

            </div>

            {/* Right Panel */}

            <div className="uforgot-right-panel">

                <div className="uforgot-card">

                    <h1>Forgot Password</h1>

                    <p>
                        Enter your registered email address
                        to receive a password reset link.
                    </p>

                    <div className="uforgot-input-group">

                        <FaEnvelope />

                        <input
                            type="email"
                            placeholder="Enter Email Address"
                        />

                    </div>

                    <button className="uforgot-btn">
                        Send Reset Link
                    </button>

                    <div className="uforgot-links">

                        <span>
                            Remember your password?
                        </span>

                        <Link to="/userlogin">
                            Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default UserForgotPassword;