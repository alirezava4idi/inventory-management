const db_pool = require('../database/connection');

async function get_user_by_username(username)
{
    const connection = await db_pool.getConnection();
    const query = "SELECT * FROM users WHERE username = ?";
    const [rows, _fields] = await connection.query(query, [username]);
    connection.release();
    if (rows != [])
    {
        return rows[0];
    }else
    {
        return undefined;
    }
}
function change_time_zone(date, tz)
{
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tz}));   

}

module.exports = { get_user_by_username, change_time_zone }