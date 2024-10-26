const pool = require("../database/");

async function addToWishlist(accountId, invId) {
  const sql = `INSERT INTO wishlist (account_id, inv_id) VALUES ($1, $2) RETURNING *;`;
  return await pool.query(sql, [accountId, invId]);
}

async function removeFromWishlist(accountId, invId) {
  const sql = `DELETE FROM wishlist WHERE account_id = $1 AND inv_id = $2;`;
  return await pool.query(sql, [accountId, invId]);
}

async function getWishlistByAccountId(accountId) {
  const sql = `
    SELECT inventory.* 
    FROM wishlist 
    JOIN inventory ON wishlist.inv_id = inventory.inv_id 
    WHERE wishlist.account_id = $1;
  `;
  return await pool.query(sql, [accountId]);
}

module.exports = { addToWishlist, removeFromWishlist, getWishlistByAccountId };
