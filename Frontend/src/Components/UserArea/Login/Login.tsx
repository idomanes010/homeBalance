import { useForm } from "react-hook-form";
import "./Login.css";
import { CredentialsModel } from "../../../Models/CredentialsModel";
import { useAuth } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../Services/AuthService";
import { notify } from "../../../Utils/Notify";

export function Login() {
    const { register, handleSubmit } = useForm<CredentialsModel>();
    const { dispatch } = useAuth();
    const navigate = useNavigate();

    async function send(credentials: CredentialsModel) {
        try {
            const { token, user, currency } = await authService.login(credentials);
            dispatch({
                type: "LOGIN",
                payload: { user, token, currency }
            });
            notify.success(`Welcome back ${user.firstName}!`);
            navigate("/dashboard");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="Login">
            <div className="login-top">
                <div className="login-logo">🏠 HomeBalance</div>
                <p className="login-tagline">The smart way to manage your household finances together.</p>
            </div>

            <div className="login-divider-horizontal" />

            <div className="login-bottom">
                <div className="login-left">
                    <h3>Why HomeBalance?</h3>
                    <div className="login-features">
                        <div className="login-feature">
                            <div className="login-feature-icon">💸</div>
                            <div>
                                <div className="feature-title">Track Expenses</div>
                                <div className="feature-desc">Log every purchase and see where money goes</div>
                            </div>
                        </div>
                        <div className="login-feature">
                            <div className="login-feature-icon">💰</div>
                            <div>
                                <div className="feature-title">Set Budgets</div>
                                <div className="feature-desc">Plan monthly budgets and stay on track</div>
                            </div>
                        </div>
                        <div className="login-feature">
                            <div className="login-feature-icon">🏠</div>
                            <div>
                                <div className="feature-title">Share With Family</div>
                                <div className="feature-desc">Invite your partner or roommates to join</div>
                            </div>
                        </div>
                        <div className="login-feature">
                            <div className="login-feature-icon">📊</div>
                            <div>
                                <div className="feature-title">Visual Insights</div>
                                <div className="feature-desc">Beautiful charts that show your spending patterns</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="login-divider-vertical" />

                <div className="login-card">
                    <h2>Welcome back</h2>
                    <p className="subtitle">Sign in to your household account</p>

                    <form onSubmit={handleSubmit(send)}>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" {...register("email")} required placeholder="you@example.com" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" {...register("password")} required placeholder="••••••••" minLength={2} maxLength={50} />
                        </div>
                        <button type="submit">Sign In</button>
                    </form>

                    <p>
                        Don't have an account yet?{" "}
                        <span onClick={() => navigate("/register")} className="link">
                            Create one here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
