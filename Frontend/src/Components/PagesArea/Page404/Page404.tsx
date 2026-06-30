import "./Page404.css";
import { useNavigate } from "react-router-dom";

export function Page404() {
    const navigate = useNavigate();

    return (
        <div className="Page404">
            <div className="page404-content">
                <div className="page404-number">404</div>
                <h2>Page Not Found</h2>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <button onClick={() => navigate("/dashboard")}>
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
}