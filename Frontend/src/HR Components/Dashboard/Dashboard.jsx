import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import WorkIcon from "@mui/icons-material/Work";
import GroupsIcon from "@mui/icons-material/Groups";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import React from 'react'

function Dashboard() {
    return (
        <section className="dashboard-home">

            {/* TOPBAR */}

            <header className="topbar">

                <div className="search-box">

                    <SearchIcon />

                    <input
                        type="text"
                        placeholder="Search jobs, applicants..."
                    />

                </div>

                <div className="topbar-right">

                    <div className="notification">

                        <NotificationsNoneIcon />

                        <span>3</span>

                    </div>

                    <div className="user-avatar">
                        A
                    </div>

                </div>

            </header>

            {/* WELCOME */}

            <section className="welcome-section">

                <h1>
                    Welcome back, Arjun! 👋
                </h1>

                <p>
                    Here's what's happening in your hiring process today.
                </p>

            </section>

            {/* STAT CARDS */}

            <section className="stats-grid">

                <article className="stat-card">

                    <div className="card-icon jobs">

                        <WorkIcon />

                    </div>

                    <div>

                        <h4>Total Jobs</h4>

                        <h2>25</h2>

                        <p className="growth purple">
                            +3 this week
                        </p>

                    </div>

                </article>

                <article className="stat-card">

                    <div className="card-icon applicants">

                        <GroupsIcon />

                    </div>

                    <div>

                        <h4>Total Applicants</h4>

                        <h2>150</h2>

                        <p className="growth blue">
                            +28 this week
                        </p>

                    </div>

                </article>

                <article className="stat-card">

                    <div className="card-icon interviews">

                        <EventIcon />

                    </div>

                    <div>

                        <h4>Interviews</h4>

                        <h2>12</h2>

                        <p className="growth pink">
                            +5 this week
                        </p>

                    </div>

                </article>

                <article className="stat-card">

                    <div className="card-icon selected">

                        <CheckCircleIcon />

                    </div>

                    <div>

                        <h4>Selected</h4>

                        <h2>8</h2>

                        <p className="growth green">
                            +2 this week
                        </p>

                    </div>

                </article>

            </section>

            <section className="middle-grid">

                {/* RECENT JOBS */}

                <div className="recent-jobs">

                    <div className="section-title">

                        <h2>Recent Job Postings</h2>

                        <button>View All Jobs</button>

                    </div>

                    <div className="job-item">

                        <div>
                            <h4>Frontend Developer</h4>
                            <p>Full Time • Chennai</p>
                        </div>

                        <div className="job-right">
                            <span>45 Applicants</span>
                            <label className="active-badge">
                                Active
                            </label>
                        </div>

                    </div>

                    <div className="job-item">

                        <div>
                            <h4>Python Developer</h4>
                            <p>Full Time • Remote</p>
                        </div>

                        <div className="job-right">
                            <span>32 Applicants</span>
                            <label className="active-badge">
                                Active
                            </label>
                        </div>

                    </div>

                    <div className="job-item">

                        <div>
                            <h4>UI/UX Designer</h4>
                            <p>Bangalore</p>
                        </div>

                        <div className="job-right">
                            <span>28 Applicants</span>
                            <label className="active-badge">
                                Active
                            </label>
                        </div>

                    </div>

                    <div className="job-item">

                        <div>
                            <h4>Backend Developer</h4>
                            <p>Hybrid</p>
                        </div>

                        <div className="job-right">
                            <span>21 Applicants</span>
                            <label className="pending-badge">
                                Pending
                            </label>
                        </div>

                    </div>

                    <button className="post-job-btn">
                        + Post New Job
                    </button>

                </div>

                {/* APPLICANTS OVERVIEW */}

                <div className="overview-card">

                    <h2>Applicants Overview</h2>

                    <div className="overview-item">

                        <span>Total Applicants</span>

                        <strong>150</strong>

                    </div>

                    <div className="overview-item">

                        <span>Pending Review</span>

                        <strong>85</strong>

                    </div>

                    <div className="overview-item">

                        <span>Shortlisted</span>

                        <strong>40</strong>

                    </div>

                    <div className="overview-item">

                        <span>Rejected</span>

                        <strong>25</strong>

                    </div>

                    <button className="view-applicants">
                        View All Applicants
                    </button>

                </div>

            </section>

            {/* RECENT APPLICATIONS */}

            <section className="applications-section">

                <div className="applications-header">

                    <h2>Recent Applications</h2>

                    <button>
                        View All Applications
                    </button>

                </div>

                <table className="applications-table">

                    <thead>

                        <tr>

                            <th>Candidate Name</th>

                            <th>Job Position</th>

                            <th>Experience</th>

                            <th>Status</th>

                            <th>Applied Date</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>Raghul Pranav</td>

                            <td>Frontend Developer</td>

                            <td>2 Years</td>

                            <td>
                                <span className="status pending">
                                    Pending
                                </span>
                            </td>

                            <td>29 May 2024</td>

                            <td>
                                <button className="view-btn">
                                    View
                                </button>
                            </td>

                        </tr>

                        <tr>

                            <td>Arun Kumar</td>

                            <td>Python Developer</td>

                            <td>3 Years</td>

                            <td>
                                <span className="status shortlisted">
                                    Shortlisted
                                </span>
                            </td>

                            <td>28 May 2024</td>

                            <td>
                                <button className="view-btn">
                                    View
                                </button>
                            </td>

                        </tr>

                        <tr>

                            <td>Karthik Raj</td>

                            <td>UI/UX Designer</td>

                            <td>2 Years</td>

                            <td>
                                <span className="status interview">
                                    Interview
                                </span>
                            </td>

                            <td>27 May 2024</td>

                            <td>
                                <button className="view-btn">
                                    View
                                </button>
                            </td>

                        </tr>

                        <tr>

                            <td>Vignesh Balaji</td>

                            <td>Backend Developer</td>

                            <td>4 Years</td>

                            <td>
                                <span className="status rejected">
                                    Rejected
                                </span>
                            </td>

                            <td>26 May 2024</td>

                            <td>
                                <button className="view-btn">
                                    View
                                </button>
                            </td>

                        </tr>

                    </tbody>

                </table>

            </section>

        </section>
    )
}

export default Dashboard