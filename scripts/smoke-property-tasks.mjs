import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const marker = `__ROLLBACK_SMOKE_${Date.now()}__`;
try {
  await connection.beginTransaction();
  const [inserted] = await connection.execute(
    "INSERT INTO property_tasks (title, location, status) VALUES (?, ?, ?)",
    [marker, "Pump House", "todo"],
  );
  await connection.execute(
    "INSERT INTO task_time_entries (taskId, workedAt, minutes, note) VALUES (?, ?, ?, ?)",
    [inserted.insertId, Date.now(), 45, marker],
  );
  const [rows] = await connection.execute(
    "SELECT t.status, t.completedAt, SUM(e.minutes) AS minutes FROM property_tasks t JOIN task_time_entries e ON e.taskId=t.id WHERE t.id=? GROUP BY t.id",
    [inserted.insertId],
  );
  if (rows.length !== 1 || Number(rows[0].minutes) !== 45 || rows[0].status !== "todo" || rows[0].completedAt !== null) {
    throw new Error("Unexpected task/time values");
  }
  await connection.rollback();
  const [remaining] = await connection.execute("SELECT COUNT(*) AS n FROM property_tasks WHERE title=?", [marker]);
  if (Number(remaining[0].n) !== 0) throw new Error("Rollback left task data");
  console.log("Task/time tables: insert, read, and rollback passed; no test rows retained.");
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
