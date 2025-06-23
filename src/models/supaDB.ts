import postgres from 'postgres'
console.log('Connecting to PostgreSQL database...', process.env.DATABASE_URL )
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:Ma$$ichiara07@localhost:5433/woridb'
console.log('Using connection string:', connectionString)
const sql = postgres(connectionString) // will use psql environment variables

export default sql 