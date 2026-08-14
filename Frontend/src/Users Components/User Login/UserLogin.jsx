import { useNavigate } from "react-router-dom";
import "./UserLogin.css";
import { FaUser, FaEnvelope, FaLock, FaCheck } from "react-icons/fa";

function UserLogin() {

    const navigate = useNavigate()

    return (

        <div className="user-login-container">

            <div className="user-left-panel">

                <div className="user-icon-box">
                    <FaUser />
                </div>

                <h1>
                    Welcome
                    <br />
                    Back
                </h1>

                {/* <div className="user-divider"></div> */}

                <p className="user-description">
                    Discover thousands of jobs and ~build your dream career with our platform.
                </p>

                <div className="user-feature-card">
                    <FaCheck />

                    <div className="user-feature-content">
                        <h3>Find Your Dream Job</h3>
                        <p>Explore jobs that match your skills and interests.</p>
                    </div>

                </div>

                <div className="user-feature-card">
                    <FaCheck />

                    <div className="user-feature-content">
                        <h3>Apply With One Click</h3>
                        <p>Quick and easy application process for every opportunity.</p>
                    </div>

                </div>

                <div className="user-feature-card">
                    <FaCheck />

                    <div className="user-feature-content">
                        <h3>Track Your Applications</h3>
                        <p>Stay updated with real-time status of all your applications.</p>
                    </div>

                </div>

            </div>

            <div className="user-right-panel">

                <div className="user-login-card">

                    <h1>User Login</h1>

                    <p>Login to explore thousands of opportunities.</p>

                    <div className="user-input-box">
                        <FaEnvelope />
                        <input type="email" placeholder="Enter Email" />
                    </div>

                    <div className="user-input-box">
                        <FaLock />
                        <input type="password" placeholder="Enter Password" />
                    </div>

                    <button className="user-login-btn">
                        Login
                    </button>

                    <div className="user-login-links">
                        <a onClick={() => navigate('/userregister')}>New User?</a>
                        <a onClick={() => navigate('/userforgot')}>Forgot Password?</a>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default UserLogin;