import { useAuth } from "../Context/AuthContext";

export function useCurrency() {
    const { state } = useAuth();

    function format(amount: number | string): string {
        return `${state.currency}${Number(amount).toFixed(2)}`;
    }

    return {
        currency: state.currency,
        format
    };
}