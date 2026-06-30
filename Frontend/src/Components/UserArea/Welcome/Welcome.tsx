import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import "./Welcome.css";
import { useState } from "react";

export function Welcome() {
    const { state } = useAuth();
    const user = state.user;
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        if (user?.inviteCode) {
            navigator.clipboard.writeText(user.inviteCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    }

    return (
        <div className="Welcome">
            <div className="welcome-content">
                <div className="welcome-emoji">🎉</div>
                <h2>Welcome to HomeBalance,<br />{user?.firstName}!</h2>
                <p>Your household has been created successfully. You're all set to start managing your finances together.</p>

                {user?.inviteCode && (
                    <div className="invite-code-box">
                        <h3>Your Household Invite Code</h3>
                        <p className="invite-desc">Share this code with your partner or roommates so they can join your household</p>
                        <div className="invite-code-row">
                            <div className="invite-code">{user.inviteCode}</div>
                            <button
                                className={`copy-btn ${copied ? "copied" : ""}`}
                                onClick={handleCopy}
                            >
                                {copied ? "✓ Copied!" : "Copy Code"}
                            </button>
                        </div>
                    </div>
                )}

                <div className="welcome-features">
                    <div className="welcome-feature">
                        <span>💸</span>
                        <span>Track expenses together</span>
                    </div>
                    <div className="welcome-feature">
                        <span>💰</span>
                        <span>Set monthly budgets</span>
                    </div>
                    <div className="welcome-feature">
                        <span>📊</span>
                        <span>View spending insights</span>
                    </div>
                </div>

                <button className="welcome-cta" onClick={() => navigate("/dashboard")}>
                    Go to Dashboard →
                </button>
            </div>
        </div>
    );
}