import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../../Models/UserModel";
import { useAuth } from "../../../Context/AuthContext";
import "./Register.css";
import { notify } from "../../../Utils/Notify";
import { authService } from "../../../Services/AuthService";

export function Register() {
    const { register, handleSubmit } = useForm<UserModel>();
    const { dispatch } = useAuth();
    const navigate = useNavigate();

    async function send(user: UserModel) {
        try {
            const { token, user: fullUser, inviteCode } = await authService.register(user);
            dispatch({
                type: "LOGIN",
                payload: { user: { ...fullUser, inviteCode }, token }
            });
            notify.success(`Welcome ${user.firstName}!`);
            navigate("/welcome");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="Register">
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
                    <h2>Create your account</h2>
                    <p className="subtitle">Start managing your household finances today</p>

                    <form onSubmit={handleSubmit(send)}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" {...register("firstName")} required placeholder="John" minLength={2} maxLength={30} />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" {...register("lastName")} required placeholder="Doe" minLength={2} maxLength={30} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" {...register("email")} required placeholder="you@example.com" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" {...register("passwordHash")} required placeholder="••••••••" minLength={2} maxLength={50} />
                        </div>
                        <div className="form-group">
                            <label>Invite Code (optional)</label>
                            <input type="text" {...register("inviteCode")} placeholder="e.g. HX7K2P" maxLength={6} />
                        </div>
                        <button type="submit">Create Account</button>
                    </form>

                    <p>
                        Already have an account?{" "}
                        <span onClick={() => navigate("/login")} className="link">
                            Sign in here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}