class AppConfig {
    public readonly serverUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    // Auth:
    public readonly registerUrl = `${this.serverUrl}/users/register`;
    public readonly loginUrl = `${this.serverUrl}/users/login`;
    public readonly usersIdUrl = `${this.serverUrl}/users/me`;

    // Household:
    public readonly householdUrl = `${this.serverUrl}/households/me`;
    public readonly householdCurrencyUrl = `${this.serverUrl}/households/currency`;

    // Expenses:
    public readonly expensesUrl = `${this.serverUrl}/expenses`;

    // Categories:
    public readonly categoriesUrl = `${this.serverUrl}/categories`;

    // Monthly Budget:
    public readonly monthlyBudgetUrl = `${this.serverUrl}/monthlyBudget`;
}

export const appConfig = new AppConfig();