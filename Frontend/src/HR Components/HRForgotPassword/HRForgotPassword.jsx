import LockResetIcon from "@mui/icons-material/LockReset";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";

function HRForgotPassword() {

    const navigate = useNavigate()

    return (
        <main className="forgot-page">

            <section className="forgot-left">

                <div className="left-content">

                    <LockResetIcon className="reset-icon" />

                    <h1>Forgot Password?</h1>

                    <p>
                        Don't worry. Enter your registered email address and we'll send you a password reset link.
                    </p>

                </div>

            </section>

            <section className="forgot-right">

                <form className="forgot-card">

                    <h2>Reset Password</h2>

                    <p className="subtitle">
                        Enter your company email
                    </p>

                    <div className="input-box">
                        <EmailIcon />

                        <input
                            type="email"
                            placeholder="Enter Company Email"
                        />
                    </div>

                    <button className="reset-btn">
                        Send Reset Link
                    </button>

                    <p className="back-login">
                        Remember Password?
                        <a onClick={() => navigate('/hrlogin')}> Login</a>
                    </p>

                </form>

            </section>

        </main>
    );
}

export default HRForgotPassword;