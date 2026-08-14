import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import ListAltIcon from "@mui/icons-material/ListAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import EventIcon from "@mui/icons-material/Event";
import BusinessIcon from "@mui/icons-material/Business";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet } from "react-router-dom";

function HRSideBar() {
    return (
        <div className="dashboard-layout">

            <aside className="sidebar">

                <div className="logo-section">

                    <div className="logo-icon">
                        <BusinessCenterIcon />
                    </div>

                    <div>
                        <h2>JobPortal</h2>
                        <p>HR Dashboard</p>
                    </div>

                </div>

                <ul className="menu">

                    <li className="active">
                        <DashboardIcon />
                        Dashboard
                    </li>

                    <li>
                        <WorkIcon />
                        Jobs
                    </li>

                    {/* <li>
                    <ListAltIcon />
                    All Jobs
                </li> */}

                    <li>
                        <GroupsIcon />
                        Applicants
                    </li>

                    {/* <li>
                    <EventIcon />
                    Interviews
                </li> */}

                    <li>
                        <BusinessIcon />
                        Company Profile
                    </li>

                    {/* <li>
                    <BarChartIcon />
                    Reports
                </li>

                <li>
                    <SettingsIcon />
                    Settings
                </li> */}

                    <li className="logout-btn">
                        <LogoutIcon />
                        Logout
                    </li>

                </ul>

                <div className="profile-card">

                    <div className="profile-avatar">
                        A
                    </div>

                    <div>
                        <h4>Arjun Kumar</h4>
                        <p>HR Manager</p>
                        <span>Tech Solutions Inc.</span>
                    </div>

                </div>

            </aside>

            <main className="dashboard-content">
                <Outlet />
            </main>

        </div>
    );
}

export default HRSideBar;