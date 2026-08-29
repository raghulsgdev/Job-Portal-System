import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CallIcon from "@mui/icons-material/Call";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";

function HRRegister() {

    const navigate = useNavigate()

    const [FormData, setFormData] = useState({
        hr_name: '',
        company_name: '',
        company_email: '',
        phone_number: '',
        password: '',
        confirm_password: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...FormData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (FormData.password !== FormData.confirm_password) {
            alert("Password do not match");
            return

        }

        try {
            const res = await api.post("/hr/register", {
                name: FormData.hr_name,
                company_name: FormData.company_name,
                email: FormData.company_email,
                phone: FormData.phone_number,
                password: FormData.password,
                confirm_password: FormData.confirm_password
            })
            console.log(res.data);
            alert("Registration Successful")

        } catch (error) {
            console.log(error);
            alert("Registration Failed")

        }

    }


    return (
        <main className="register-page">

            <section className="register-left">

                <div className="left-content">

                    <BusinessCenterIcon className="company-icon" />

                    <h1>Join JobPortal</h1>

                    <p>
                        Create your HR account and start hiring the best candidates for your organization.
                    </p>

                    <div className="features">

                        <div className="feature">
                            ✓ Create Job Listings
                        </div>

                        <div className="feature">
                            ✓ Manage Applications
                        </div>

                        <div className="feature">
                            ✓ Build Your Dream Team
                        </div>

                    </div>

                </div>

            </section>

            <section className="register-right">

                <form className="register-card" onSubmit={handleSubmit}>

                    <h2>Create HR Account</h2>

                    <p className="subtitle">
                        Start recruiting in minutes.
                    </p>

                    <div className="input-box">
                        <PersonIcon />
                        <input
                            type="text"
                            placeholder="HR Name"
                            name="hr_name"
                            value={FormData.hr_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-box">
                        <ApartmentIcon />
                        <input
                            type="text"
                            placeholder="Company Name"
                            name="company_name"
                            value={FormData.company_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-box">
                        <EmailIcon />
                        <input
                            type="email"
                            placeholder="Company Email"
                            name="company_email"
                            value={FormData.company_email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-box">
                        <CallIcon />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            name="phone_number"
                            value={FormData.phone_number}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-box">
                        <LockIcon />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={FormData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-box">
                        <LockIcon />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="confirm_password"
                            value={FormData.confirm_password}
                            onChange={handleChange}
                        />
                    </div>

                    <button className="register-btn" type="sumbit">
                        Create Account
                    </button>

                    <p className="login-link">
                        Already have an account?
                        <a onClick={() => navigate('/hrlogin')}> Login</a>
                    </p>

                </form>

            </section>

        </main>
    );
}

export default HRRegister;