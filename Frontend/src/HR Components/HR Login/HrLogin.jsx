import "./HRLogin.css";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import api from "../../services/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function HrLogin() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        company_email: '',
        password: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await api.post("/hr/login", {
                email: formData.company_email,
                password: formData.password
            });
            console.log(res.data);
            alert(`Login Successful. Welcome Back! ${res.data.user?.name}`)
            
            
        } catch (error) {
            console.log(error);
            alert("Login Failed")
            
        }

        navigate("/hrsidebar")
    }


    return (
        <main className="login-page">
            <section className="login-left">

                <div className="left-content">

                    <BusinessCenterIcon className="company-icon" />

                    <h1>
                        Welcome Back
                    </h1>

                    {/* <p>
                        Access your recruitment dashboard,
                        manage job postings,
                        track applicants,
                        and hire top talent faster.
                    </p> */}

                    <div className="features">

                        <div className="feature">
                            ✓ Post Unlimited Jobs
                        </div>

                        <div className="feature">
                            ✓ Manage Applicants
                        </div>

                        <div className="feature">
                            ✓ Smart Hiring Process
                        </div>

                    </div>

                </div>

            </section>

            <section className="login-right">
                <form className="login-card" onSubmit={handleSubmit}>

                    <h2>HR Login</h2>

                    <p className="subtitle">
                        Welcome back! Login to continue.
                    </p>

                    <div className="input-box">
                        <EmailIcon />
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name="company_email"
                            value={formData.company_email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-box">
                        <LockIcon />
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit">
                        Login
                    </button>

                    <div className="bottom-section">
                        <p className="new" onClick={() => navigate('/hrregister')}>
                            New HR?
                        </p>

                        <p className="forgot" onClick={() => navigate('/hrforgot')}>
                            Forgot Password?
                        </p>
                    </div>

                </form>
            </section>
        </main>
    );
}

export default HrLogin;