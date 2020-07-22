const sqlite3 = require('sqlite3').verbose();
const { open: openDatabase } = require('sqlite');

const createScript = `CREATE TABLE users (
      id varchar(42) PRIMARY KEY,
      display_name text NOT NULL DEFAULT 'Expresser',
      avatar_url text NOT NULL,
      bio text
    )`;

const insertionScript = `INSERT INTO	users(id, display_name, avatar_url) VALUES
      ('bernie-walker','Bernard','https://avatars2.githubusercontent.com/u/58025656?v=4')`;

const initializeDataBase = async function (dataBaseName) {
  const dataBase = await openDatabase({
    filename: dataBaseName,
    driver: sqlite3.Database,
  });

  await dataBase.run(createScript);
  await dataBase.run(insertionScript);

  return dataBase;
};

const addNewUserToDB = async function (db, userId, avatar, displayName) {
  const response = { userAdded: true, err: null };

  let query = `INSERT INTO users(id, avatar_url) VALUES('${userId}','${avatar}')`;

  if (displayName) {
    query = `INSERT INTO users(id, avatar_url, display_name) VALUES('${userId}', '${avatar}', '${displayName}')`;
  }

  await db.run(query).catch((err) => {
    response.err = err.message;
    response.userAdded = false;
  });

  return response;
};

class Users {
  constructor(db) {
    this.db = db;
  }

  addUser(userId, avatar, displayName) {
    return new Promise((resolve) => {
      addNewUserToDB(this.db, userId, avatar, displayName).then(resolve);
    });
  }

  editUserName(userId, newName) {
    const query = `UPDATE users SET display_name='${newName}' WHERE id='${userId}'`;
    return this.db.run(query);
  }

  updateUserBio(userId, newBio) {
    const query = `UPDATE users SET bio='${newBio}' WHERE id='${userId}'`;
    return this.db.run(query);
  }

  getUserInfo(userId) {
    const query = `SELECT * FROM users WHERE id='${userId}'`;
    return this.db.get(query);
  }
}

module.exports = { initializeDataBase, Users };
