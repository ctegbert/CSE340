const pool = require("../database/");

async function addFavorite(accountId, invId) {
  const sql = `INSERT INTO favorites (account_id, inv_id) VALUES ($1, $2) RETURNING *;`;
  return pool.query(sql, [accountId, invId]);
}

async function removeFavorite(accountId, invId) {
  const sql = `DELETE FROM favorites WHERE account_id = $1 AND inv_id = $2;`;
  return pool.query(sql, [accountId, invId]);
}

async function getFavoritesByAccountId(accountId) {
  const sql = `
    SELECT i.* FROM favorites f
    JOIN inventory i ON f.inv_id = i.inv_id
    WHERE f.account_id = $1;
  `;
  return pool.query(sql, [accountId]);
}

async function checkVehicleExists(invId) {
  const sql = `SELECT * FROM inventory WHERE inv_id = $1;`;
  const result = await pool.query(sql, [invId]);
  return result.rows.length > 0; 
}

module.exports = { addFavorite, removeFavorite, getFavoritesByAccountId, checkVehicleExists };
