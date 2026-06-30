import dotenv from "dotenv";

dotenv.config({ quiet: true });

class AppConfig {
    public readonly isDevelopment = process.env.ENVIRONMENT === "development";
    public readonly isProduction = process.env.ENVIRONMENT === "production";
    public readonly port = Number(process.env.PORT);
    public readonly postgresPort = Number(process.env.POSTGRES_PORT);
    public readonly postgresHost = process.env.POSTGRES_HOST;
    public readonly postgresUser = process.env.POSTGRES_USER;
    public readonly postgresPassword = process.env.POSTGRES_PASSWORD;
    public readonly postgresDatabase = process.env.POSTGRES_DATABASE;
    public readonly hashSalt = process.env.HASH_SALT!;
    public readonly jwtSecret = process.env.JWT_SECRET!;

}

export const appConfig = new AppConfig();
