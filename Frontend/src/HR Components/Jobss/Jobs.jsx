import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Jobs() {

    const jobs = [
        {
            id: 1,
            title: "Frontend Developer",
            location: "Chennai",
            salary: "5 - 8 LPA",
            status: "Active"
        },
        {
            id: 2,
            title: "Python Developer",
            location: "Remote",
            salary: "6 - 10 LPA",
            status: "Active"
        },
        {
            id: 3,
            title: "UI/UX Designer",
            location: "Bangalore",
            salary: "4 - 7 LPA",
            status: "Closed"
        }
    ];

    return (
        <main className="jobs-page">

            <div className="jobs-header">

                <div>
                    <h1>Jobs Management</h1>
                    <p>
                        Manage all your job postings
                    </p>
                </div>

                <button className="add-job-btn">

                    <AddIcon />

                    Post New Job

                </button>

            </div>

            <section className="jobs-container">

                {
                    jobs.map((job) => (

                        <article
                            key={job.id}
                            className="job-card"
                        >

                            <div>

                                <h3>
                                    {job.title}
                                </h3>

                                <p>
                                    📍 {job.location}
                                </p>

                                <p>
                                    💰 {job.salary}
                                </p>

                            </div>

                            <div className="job-right">

                                <span
                                    className={
                                        job.status === "Active"
                                            ? "active-status"
                                            : "closed-status"
                                    }
                                >
                                    {job.status}
                                </span>

                                <div className="action-btns">

                                    <button>
                                        <EditIcon />
                                    </button>

                                    <button>
                                        <DeleteIcon />
                                    </button>

                                </div>

                            </div>

                        </article>

                    ))
                }

            </section>

        </main>
    );
}

export default Jobs;