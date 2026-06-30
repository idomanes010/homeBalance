import "./LandingPage.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

export function LandingPage() {
    const { state } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (state.isLoggedIn) {
            navigate("/dashboard");
        }
    }, [state.isLoggedIn]);

    return (
        <div className="LandingPage">

            {/* Hero section */}
            <div className="landing-hero">
                <div className="landing-logo">🏠 HomeBalance</div>
                <h1 className="landing-headline">
                    Manage your household finances,<br />
                    <span className="landing-headline-accent">together.</span>
                </h1>
                <p className="landing-subheadline">
                    The smart way for families, couples, and roommates to track expenses,
                    set budgets, and stay on top of their finances.
                </p>
                <div className="landing-cta">
                    <button className="cta-primary" onClick={() => navigate("/register")}>
                        Get Started — It's Free
                    </button>
                    <button className="cta-secondary" onClick={() => navigate("/login")}>
                        Sign In
                    </button>
                </div>
            </div>

            {/* Divider */}
            <div className="landing-divider" />

            {/* Features */}
            <div className="landing-features-title">Everything your household needs</div>
            <div className="landing-features">
                <div className="landing-feature">
                    <div className="landing-feature-icon">💸</div>
                    <h3>Track Expenses</h3>
                    <p>Log and categorize every expense your household makes. Never lose track of where money goes.</p>
                </div>
                <div className="landing-feature">
                    <div className="landing-feature-icon">💰</div>
                    <h3>Set Budgets</h3>
                    <p>Set monthly budgets per category and get a clear picture of how you're tracking.</p>
                </div>
                <div className="landing-feature">
                    <div className="landing-feature-icon">🏠</div>
                    <h3>Share With Family</h3>
                    <p>Invite your partner or roommates with a simple code. Everyone stays in sync.</p>
                </div>
                <div className="landing-feature">
                    <div className="landing-feature-icon">📊</div>
                    <h3>Visual Insights</h3>
                    <p>Beautiful charts and reports that show exactly where your money goes each month.</p>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="landing-bottom-cta">
                <h2>Ready to take control of your finances?</h2>
                <button className="cta-primary" onClick={() => navigate("/register")}>
                    Create Your Household
                </button>
            </div>

        </div>
    );
}