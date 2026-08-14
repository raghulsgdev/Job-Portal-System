import React from 'react'
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CallIcon from "@mui/icons-material/Call";
import WorkIcon from "@mui/icons-material/Work";
import GroupsIcon from "@mui/icons-material/Groups";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SecurityIcon from "@mui/icons-material/Security";
import GppGoodIcon from "@mui/icons-material/GppGood";
import { useNavigate } from 'react-router-dom';


function Index() {

    const navigate = useNavigate()

    return (

        <div>
            <header className="header">
                <div className="logo-container">
                    {/* <span className="material-symbols-outlined logo-icon">
                        business_center
                    </span> */}
                    <BusinessCenterIcon sx={{ color: "#6366f1", fontSize: "40px", marginBottom: "8px" }} />
                    <h1>
                        Job<span>Portal</span>
                    </h1>
                </div>

                <nav>
                    <ul className="nav-links">
                        <li>
                            {/* <span className="material-symbols-outlined">home</span> */}
                            <HomeIcon />
                            Home
                        </li>
                        <li>
                            {/* <span className="material-symbols-outlined">info</span> */}
                            <InfoIcon />
                            About
                        </li>
                        <li>
                            {/* <span className="material-symbols-outlined">call</span> */}
                            <CallIcon />
                            Contact
                        </li>
                    </ul>
                </nav>
            </header>

            <main>
                <section className="hero">
                    <p className="badge">Welcome to JobPortal</p>

                    <h2>
                        Find the Right <span>Opportunity</span>
                        <br />
                        or the Right <span>Talent</span>
                    </h2>

                    <p className="hero-text">
                        A platform that connects talented people with amazing companies and
                        opportunities.
                    </p>

                    {/* <div className="slider-dots">
                        <span className="active"></span>
                        <span></span>
                    </div> */}
                </section>

                <section className="portal-cards">
                    <article className="card">
                        {/* <div className="card-icon">
                            <span className="material-symbols-outlined">groups</span>
                        </div> */}
                        <GroupsIcon sx={{ color: "#6366f1", fontSize: "60px" }} />

                        <h3 className='h3'>HR / Recruiter</h3>

                        <p>
                            Post jobs, manage applicants and find the best talent for your
                            company.
                        </p>

                        <button onClick={() => navigate('/hrlogin')}>HR Login</button>
                    </article>

                    <article className="card">
                        <div className="card-icon blue">
                            {/* <span className="material-symbols-outlined">
                                business_center
                            </span> */}
                            <BusinessCenterIcon sx={{ color: "#6366f1", fontSize: "50px" }} />
                        </div>

                        <h3>Job Seeker</h3>

                        <p>
                            Find jobs, apply to companies and build your dream career.
                        </p>

                        <button onClick={() => navigate('/userlogin')}>User Login</button>
                    </article>
                </section>
            </main>

            <footer className="footer">
                <div className="feature">
                    {/* <span className="material-symbols-outlined">verified_user</span> */}
                    <VerifiedUserIcon sx={{ color: "#6366f1", fontSize: "50px" }} />
                    <div>
                        <h4>Secure & Reliable</h4>
                        <p>Your data is safe with us</p>
                    </div>
                </div>

                <div className="feature">
                    {/* <span className="material-symbols-outlined">rocket_launch</span> */}
                    <RocketLaunchIcon sx={{ color: "#6366f1", fontSize: "50px" }} />
                    <div>
                        <h4>Fast & Easy</h4>
                        <p>Simple steps to get started</p>
                    </div>
                </div>

                <div className="feature">
                    {/* <span className="material-symbols-outlined">groups</span> */}
                    <GroupsIcon sx={{ color: "#6366f1", fontSize: "50px" }} />

                    <div>
                        <h4>Connect & Grow</h4>
                        <p>Build connections for success</p>
                    </div>
                </div>

                <div className="feature">
                    {/* <span className="material-symbols-outlined">workspace_premium</span> */}
                    <GppGoodIcon sx={{ color: "#6366f1", fontSize: "50px" }} />
                    <div>
                        <h4>Trusted Platform</h4>
                        <p>Thousands of users trust us</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Index