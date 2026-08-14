import "./UserRegister.css";
import {
    FaUser,
    FaCheck,
    FaEnvelope,
    FaLock,
    FaPhoneAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function UserRegister() {
    return (
        <div className="ureg-container">

            {/* Left Panel */}

            <div className="ureg-left-panel">

                <div className="ureg-icon-box">
                    <FaUser />
                </div>

                <h1>
                    Create 
                    <br />
                    Account
                </h1>

                {/* <div className="ureg-divider"></div> */}

                <p className="ureg-description">
                    Join thousands of professionals and start your journey
                    toward your dream career today.
                </p>

                <div className="ureg-feature-card">
                    <FaCheck />

                    <div className="ureg-feature-content">
                        <h3>Build Your Profile</h3>
                        <p>
                            Create a professional profile and showcase
                            your skills.
                        </p>
                    </div>
                </div>

                <div className="ureg-feature-card">
                    <FaCheck />

                    <div className="ureg-feature-content">
                        <h3>Apply to Top Companies</h3>
                        <p>
                            Access opportunities from trusted companies
                            across industries.
                        </p>
                    </div>
                </div>

                <div className="ureg-feature-card">
                    <FaCheck />

                    <div className="ureg-feature-content">
                        <h3>Grow Your Career</h3>
                        <p>
                            Receive updates and track every application
                            in one place.
                        </p>
                    </div>
                </div>

            </div>

            {/* Right Panel */}

            <div className="ureg-right-panel">

                <div className="ureg-card">

                    <h1>User Register</h1>

                    <p>Create your account to get started.</p>

                    <div className="ureg-input-group">
                        <FaUser />
                        <input
                            type="text"
                            placeholder="Full Name"
                        />
                    </div>

                    <div className="ureg-input-group">
                        <FaEnvelope />
                        <input
                            type="email"
                            placeholder="Email Address"
                        />
                    </div>

                    <div className="ureg-input-group">
                        <FaPhoneAlt />
                        <input
                            type="text"
                            placeholder="Mobile Number"
                        />
                    </div>

                    <div className="ureg-input-group">
                        <FaLock />
                        <input
                            type="password"
                            placeholder="Password"
                        />
                    </div>

                    <div className="ureg-input-group">
                        <FaLock />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                        />
                    </div>

                    <button className="ureg-register-btn">
                        Register
                    </button>

                    <div className="ureg-links">
                        <span>Already have an account?</span>

                        <Link to="/userlogin">
                            Login
                        </Link>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default UserRegister;