const Datastore = require('nedb-promises');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const users = Datastore.create({ filename: path.join(dataDir, 'users.db'), autoload: true });
const files = Datastore.create({ filename: path.join(dataDir, 'files.db'), autoload: true });
const folders = Datastore.create({ filename: path.join(dataDir, 'folders.db'), autoload: true });
const activities = Datastore.create({ filename: path.join(dataDir, 'activities.db'), autoload: true });

module.exports = { users, files, folders, activities };
