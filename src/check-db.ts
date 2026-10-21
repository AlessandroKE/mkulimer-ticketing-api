import {pool} from './db/pool.js';

type DatabaseCheckResult = {
    database: string;
    server_time: string;
};

async function checkDatabaseConnection() {
    
        const results = await pool.query<DatabaseCheckResult>('SELECT current_database() AS database, NOW() AS server_time');
        const row = results.rows[0];

        if (!row) { throw new Error('No data returned from the database'); }

        console.log('Database connection successful!');
        console.log(`Connected to database: ${row.database}`);
        console.log(`Server time: ${row.server_time}`);
}

try {await checkDatabaseConnection(); 

}
    catch (error){
        console.error("Error checking database connection:", error);
        process.exit(1);
    }
finally{
    await pool.end();
}
