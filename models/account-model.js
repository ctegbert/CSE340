// Needed Resources
const pool = require("../database/index");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getAccountById(accountId) {
  try {
    const result = await pool.query(
      'SELECT * FROM account WHERE account_id = $1',
      [accountId]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("No matching account found");
  }
}


/* *****************************
* Update account data by ID
* ***************************** */
async function updateAccountById(accountId, firstname, lastname, email) {
  try {
    const sql = `
      UPDATE account 
      SET account_firstname = $1, account_lastname = $2, account_email = $3 
      WHERE account_id = $4 
      RETURNING *;
    `;
    const result = await pool.query(sql, [firstname, lastname, email, accountId]);
    return result;
  } catch (error) {
    console.error("Error updating account: " + error);
    throw error;
  }
}

/* *****************************
* Update password by account ID
* ***************************** */
async function updatePasswordById(accountId, hashedPassword) {
  try {
    const sql = `
      UPDATE account 
      SET account_password = $1 
      WHERE account_id = $2 
      RETURNING *;
    `;
    const result = await pool.query(sql, [hashedPassword, accountId]);
    return result;
  } catch (error) {
    console.error("Error updating password: " + error);
    throw error;
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccountById, updatePasswordById };

