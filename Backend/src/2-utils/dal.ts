import { Pool, PoolClient, QueryResult } from "pg";
import { appConfig } from "./app-config";

class Dal {

    private readonly pool = new Pool({
        host: appConfig.postgresHost,
        user: appConfig.postgresUser,
        password: appConfig.postgresPassword,
        database: appConfig.postgresDatabase,
        port: appConfig.postgresPort,
    });

    public async execute(
        sql: string,
        values?: (string | number | null)[]
    ): Promise<QueryResult> {
        return await this.pool.query(sql, values);
    }

    public async transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");
            const result = await fn(client);
            await client.query("COMMIT");
            return result;
        }
        catch (err) {
            await client.query("ROLLBACK");
            throw err;
        }
        finally {
            client.release();
        }
    }
}

export const dal = new Dal();































// class Dal {

//     private readonly pool = new Pool({
//         host: appConfig.postgresHost,
//         user: appConfig.postgresUser,
//         password: appConfig.postgresPassword,
//         database: appConfig.postgresDatabase,
//         port: appConfig.postgresPort,
//     });

//     public async execute(
//         sql: string,
//         values?: (string | number | null)[]
//     ): Promise<QueryResult> {

//         return await this.pool.query(sql, values);
//     }
// }

// export const dal = new Dal();
