import { useState, useEffect } from "react";
import { HouseholdModel } from "../../../Models/HouseholdModel";
import { householdService } from "../../../Services/HouseholdService";
import "./Household.css";
// import { useNavigate } from "react-router-dom";
import { notify } from "../../../Utils/Notify";
import { useAuth } from "../../../Context/AuthContext";
import { Spinner } from "../../SharedArea/Spinner/Spinner";

export function Household() {
    const [household, setHousehold] = useState<HouseholdModel | null>(null);
    const [copied, setCopied] = useState(false);
    const { state, dispatch } = useAuth();
    // const navigate = useNavigate();

    useEffect(() => {
        async function fetchHousehold() {
            try {
                const data = await householdService.getHousehold();
                setHousehold(data);
            }
            catch (err: any) {
                notify.error(err);
            }
        }
        fetchHousehold();
    }, []);

    async function handleCurrencyChange(currency: string) {
        try {
            await householdService.updateCurrency(currency);
            dispatch({ type: "SET_CURRENCY", payload: currency });
            notify.success("Currency updated!");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    function handleCopy() {
        navigator.clipboard.writeText(household!.inviteCode!);
        setCopied(true);
        notify.success("Invite code copied!");
        setTimeout(() => setCopied(false), 2500);
    }

    if (!household) return <Spinner />;

    return (
        <div className="Household">
            <div className="household-header">
                <h2>{household.houseName}</h2>
                <p className="household-subtitle">Manage your household members and invite code</p>
            </div>

            {/* Tips */}
            <div className="household-tips">
                <div className="household-tip">
                    <span className="tip-icon">👨‍👩‍👧</span>
                    <div>
                        <div className="tip-title">Stay in Sync</div>
                        <div className="tip-desc">Everyone sees the same expenses in real time</div>
                    </div>
                </div>
                <div className="household-tip">
                    <span className="tip-icon">💬</span>
                    <div>
                        <div className="tip-title">No More Surprises</div>
                        <div className="tip-desc">Track who spent what and when</div>
                    </div>
                </div>
                <div className="household-tip">
                    <span className="tip-icon">🎯</span>
                    <div>
                        <div className="tip-title">Shared Goals</div>
                        <div className="tip-desc">Set budgets and reach financial goals together</div>
                    </div>
                </div>
            </div>

            <div className="invite-section">
                <h3>Invite Code</h3>
                <p>Share this code with anyone you want to join your household</p>
                <div className="invite-code-row">
                    <div className="invite-code">{household.inviteCode}</div>
                    <button
                        className={`copy-btn ${copied ? "copied" : ""}`}
                        onClick={handleCopy}
                    >
                        {copied ? "✓ Copied!" : "Copy Code"}
                    </button>
                </div>
                <div className="currency-section">
                    <h3>Currency</h3>
                    <p>Select the currency for your household</p>
                    <div className="currency-options">
                        {[
                            { symbol: "$", label: "USD — Dollar" },
                            { symbol: "€", label: "EUR — Euro" },
                            { symbol: "₪", label: "ILS — Shekel" },
                            { symbol: "£", label: "GBP — Pound" },
                        ].map(c => (
                            <button
                                key={c.symbol}
                                className={`currency-btn ${state.currency === c.symbol ? "active" : ""}`}
                                onClick={() => handleCurrencyChange(c.symbol)}
                            >
                                <span className="currency-symbol">{c.symbol}</span>
                                <span className="currency-label">{c.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="members-section">
                <h3>Members ({household.members?.length || 0})</h3>
                {household.members?.map(member => (
                    <div key={member.id || (member as any).userId} className="member-row">
                        <div className="member-avatar">
                            {member.firstName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="member-name">{member.firstName} {member.lastName}</span>
                        <span className="member-email">{member.email}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}