import postgres from "postgres";

export const sql = postgres({
    host: "localhost",
    port: 5432,
    db: "test_db",
    username: "postgres",
    password: "root"
})