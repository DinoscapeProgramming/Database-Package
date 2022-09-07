const fs = require('fs');
const crypto = require('crypto');

function readFile(options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "readFile", err: "No options were given" });
    if (Object.keys(options).includes("path") || !options.path) return resolve({ action: "readFile", err: "No path was given" });
    fs.readFile(options.path, (err, data) => {
      if (err) return resolve({ action: "readFile", err: err.message });
      return resolve({ action: "readFile", data: JSON.parse(data) });
    });
  });
}

function readFileSync(options) {
  if (!options || Object.keys(options).length === 0) return { action: "readFileSync", err: "No options were given" };
  if (Object.keys(options).includes("file") || !options.file) return { action: "readFileSync", err: "No folder was given" };
  var result;
  try {
    result = fs.readFileSync(options.file, "utf8");
  } catch (err) {
    return { action: "readFileSync", err: err.message };
  }
  return { action: "readFileSync", data: JSON.parse(result) };
}

function isFolder(options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "isFolder", err: "No options were given" });
    if (Object.keys(options).includes("folder") || !options.folder) return resolve({ action: "isFolder", err: "No folder was given" });
    fs.stat(options.folder).then((err, stats) => {
      if (err) return resolve({ action: "isFolder", err: err.message });
      if (!stats.isFolder()) return resolve({ action: "isFolder", result: false });
      return resolve({ action: "isFolder", result: true });
    });
  });
}

function isFolderSync(options) {
  if (!options || Object.keys(options).length === 0) return { action: "isFolderSync", err: "No options were given" };
  if (Object.keys(options).includes("folder") || !options.folder) return { action: "isFolderSync", err: "No folder was given" };
  var stats;
  try {
    stats = fs.statSync(options.folder);
  } catch (err) {
    return { action: "isFolderSync", err: err.message };
  }
  if (!stats.isFolder()) return { action: "isFolderSync", result: false };
  return { action: "isFolderSync", result: true };
}

function convertToEnvironmentObject(options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "convertToEnvironmentObject", err: "No options were given" });
    if (Object.keys(options).includes("path") || !options.path) return resolve({ action: "convertToEnvironmentObject", err: "No path was given" });
    fs.readFile(options.path, (err, data) => {
      if (err) return resolve({ action: "convertToEnvironmentObject", err: err.message });
      return resolve({
        action: "convertToEnvironmentObject",
        object: data.toString().split("\n").map((item) => item.split("=")).reduce((args, item) => ({ ...args, [item[0]]: item[1] }), {})
      });
    });
  });
}

function convertToEnvironmentObjectSync(options) {
  if (!options || Object.keys(options).length === 0) return { action: "convertToEnvironmentObjectSync", err: "No options were given" };
  if (Object.keys(options).includes("path") || !options.path) return { action: "convertToEnvironmentObjectSync", err: "No path was given" };
  var data;
  try {
    data = fs.readFileSync(options.path, "utf8");
  } catch (err) {
    return { action: "convertToEnvironmentObjectSync", err: err.message }
  }
  return {
    action: "convertToEnvironmentObjectSync",
    object: data.toString().split("\n").map((item) => item.split("=")).reduce((args, item) => ({ ...args, [item[0]]: item[1] }), {})
  };
}

function config(options) {
  return new Promise((resolve, reject) => {
    if (!options || typeof options !== "object") return resolve({ action: "config", err: "Invalid options" });
    module.exports = {
      options
    }
    return resolve({ action: "config", options });
  });
}

function configSync(options) {
  if (!options || typeof options !== "object") return { action: "configSync", err: "Invalid options" };
  module.exports = {
    options
  }
  return { action: "configSync", options };
}

function registerDatabase(options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "registerDatabase", err: "No options were given" });
    if (Object.keys(options).includes("folder") || !options.folder) return resolve({ action: "registerDatabase", err: "No folder was given" });
    if (!Object.keys(options).includes("type") || !options.type) return resolve({ action: "registerDatabase", err: "No type was given" });
    crypto.randomBytes(4, function (err, id) {
      if (err) return resolve({ action: "registerDatabase", err: err.message });
      module.exports = {
        databases: [
          ...module.exports.databases || [],
          ...[
            {
              name: options.name || null,
              id: id.toString('hex'),
              type: options.type,
              folder: options.folder
            }
          ]
        ]
      }
      return resolve({ action: "registerDatabase", id: id.toString('hex'), name: options.name || null, folder: options.folder });
    });
  });
}

function registerDatabaseSync(options) {
  if (!options || Object.keys(options).length === 0) return { action: "registerDatabaseSync", err: "No options were given" };
  if (!Object.keys(options).includes("folder") || !options.folder) return { action: "registerDatabaseSync", err: "No folder was given" };
  if (!Object.keys(options).includes("type") || !options.type) return { action: "registerDatabaseSync", err: "No type was given" };
  var id;
  try {
    id = crypto.randomBytes(4).toString("hex");
  } catch (err) {
    return { action: "registerDatabaseSync", err: err.message };
  }
  module.exports = {
    databases: [
      ...module.exports.databases || [],
      ...[
        {
          name: options.name || null,
          id,
          type: options.type,
          folder: options.folder
        }
      ]
    ]
  }
  return { action: "registerDatabaseSync", id, name: options.name || null, folder: options.folder };
}

function addItem(options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "addItem", err: "No options were given" });
    if (!Object.keys(options).includes("path") || !options.path) return resolve({ action: "addItem", err: "No path was given" });
    if (!Object.keys(options).includes("type") || !options.type) return resolve({ action: "addItem", err: "No type was given" });
    if (!Object.keys(options).includes("value") || !options.value) return resolve({ action: "addItem", err: "No value was given" });
    if (options.type === "array") {
      fs.writeFile(options.path, JSON.stringify([
        ...readFileSync({ path: options.path }).data || [],
        ...[options.value]
      ]), 'utf8', (err) => {
        if (err) return resolve({ action: "addItem", err: err.message });
        return resolve({ action: "addItem", path: options.path, type: options.type, value: options.value });
      });
    } else {
      return resolve({ action: "addItem", err: "Invalid type" });
    }
  });
}

function addItemSync(options) {
  if (!options || Object.keys(options).length === 0) return { action: "addItemSync", err: "No options were given" };
  if (!Object.keys(options).includes("path") || !options.path) return { action: "addItemSync", err: "No path was given" };
  if (!Object.keys(options).includes("type") || !options.type) return { action: "addItemSync", err: "No type was given" };
  if (!Object.keys(options).includes("value") || !options.value) return { action: "addItemSync", err: "No value was given" };
  if (options.type === "array") {
    try {
      fs.writeFileSync(options.path, JSON.stringify([
        ...readFileSync({ path: options.path }).data || [],
        ...[options.value]
      ]), 'utf8');
    } catch (err) {
      return { action: "addItemSync", err: err.message };
    }
    return { action: "addItemSync", path: options.path, type: options.type, value: options.value };
  } else {
    return { action: "addItemSync", err: "Invalid type" };
  }
}

function setItem(options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "setItem", err: "No options were given" });
    if (!Object.keys(options).includes("path") || !options.path) return resolve({ action: "setItem", err: "No path was given" });
    if (!Object.keys(options).includes("type") || !options.type) return resolve({ action: "setItem", err: "No type was given" });
    if (!Object.keys(options).includes("value") || !options.value) return resolve({ action: "setItem", err: "No value was given" });
    if ((options.type === "object") && (!Object.keys(options).includes("key") || !options.key)) return resolve({ action: "setItem", err: "No key was given" });
    if ((options.type === "array") && (!Object.keys(options).includes("index") || !options.index)) return resolve({ action: "setItem", err: "No index was given" });
    if ((options.type === "array") && (typeof options.index !== "number")) return resolve({ action: "setItem", err: "Invalid index" });
    if (options.type === "object") {
      fs.writeFile(options.path, JSON.stringify({
        ...readFileSync({ path: options.path }).data || {},
        ...{
          [options.key]: options.value
        }
      }), 'utf8', (err) => {
        if (err) return resolve({ action: "setItem", err: err.message });
        return resolve({ action: "setItem", path: options.path, type: options.type, key: options.key, value: options.value });
      });
    } else if (options.type === "array") {
      var buffer = readFileSync({ path: options.path }).data;
      buffer.splice(options.index, 0, options.value);
      fs.writeFile(options.path, JSON.stringify(buffer), 'utf8', (err) => {
        if (err) return resolve({ action: "setItem", err: err.message });
        return resolve({ action: "setItem", path: options.path, type: options.type, value: options.value, [(options.type === "object") ? "key" : "index"]: (options.type === "object") ? options.key : options.index });
      });
    } else {
      return resolve({ action: "setItem", err: "Invalid type" });
    }
  });
}

function setItemSync(options) {
  if (!options || Object.keys(options).length === 0) return { action: "setItemSync", err: "No options were given" };
  if (!Object.keys(options).includes("path") || !options.path) return { action: "setItemSync", err: "No path was given" };
  if (!Object.keys(options).includes("type") || !options.type) return { action: "setItemSync", err: "No type was given" };
  if (!Object.keys(options).includes("value") || !options.value) return { action: "setItemSync", err: "No value was given" };
  if ((options.type === "object") && (!Object.keys(options).includes("key") || !options.key)) return { action: "setItemSync", err: "No key was given" };
  if ((options.type === "array") && (!Object.keys(options).includes("index") || !options.index)) return { action: "setItemSync", err: "No index was given" };
  if ((options.type === "array") && (typeof options.index !== "number")) return { action: "setItemSync", err: "Invalid index" };
  if (options.type === "object") {
    try {
      fs.writeFileSync(options.path, JSON.stringify({
        ...readFileSync({ path: options.path }).data || {},
        ...{
          [options.key]: options.value
        }
      }), 'utf8');
    } catch (err) {
      return { action: "setItemSync", err: err.message };
    }
    return { action: "setItemSync", path: options.path, type: options.type, key: options.key, value: options.value };
  } else if (options.type === "array") {
    var buffer = readFileSync({ path: options.path }).data;
    buffer.splice(options.index, 0, options.value);
    try {
      fs.writeFileSync(options.path, JSON.stringify(buffer), 'utf8');
    } catch (err) {
      return { action: "setItemSync", err: err.message };
    }
    return { action: "setItemSync", path: options.path, type: options.type, value: options.value, [(options.type === "object") ? "key" : "index"]: (options.type === "object") ? options.key : options.index };
  } else {
    return { action: "setItemSync", err: "Invalid type" };
  }
}

function removeItem(options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "removeItem", err: "No options were given" });
    if (!Object.keys(options).includes("path") || !options.path) return resolve({ action: "removeItem", err: "No path was given" });
    if (!Object.keys(options).includes("type") || !options.type) return resolve({ action: "removeItem", err: "No type was given" });
    if ((options.type === "object") && (!Object.keys(options).includes("key") || !options.key)) return resolve({ action: "removeItem", err: "No key was given "});
    if ((options.type === "array") && (!Object.keys(options).includes("index") || !options.index)) return resolve({ action: "removeItem", err: "No index was given "});
    fs.writeFile(options.path, ((options.type === "object") ? Object.entries(readFileSync({ path: options.path })).filter((item) => item[0] !== options.key).data.reduce((data, item) => ({ ...data, [item[0]]: item[1]}), {}) : readFileSync({ path: options.path }).data.filter((_, index) => index !== options.index)), 'utf8', function (err) {
      if (err) return resolve({ action: "removeItem", err: err.message });
      return resolve({ action: "removeItem", path: options.path, type: options.type, [(options.type === "object") ? "key" : "index"]: (options.type === "object") ? options.key : options.index });
    });
  });
}

function removeItemSync(options) {
  if (!options || Object.keys(options).length === 0) return { action: "removeItemSync", err: "No options were given" };
  if (!Object.keys(options).includes("path") || !options.path) return { action: "removeItemSync", err: "No path was given" };
  if (!Object.keys(options).includes("type") || !options.type) return { action: "removeItemSync", err: "No type was given" };
  if ((options.type === "object") && (!Object.keys(options).includes("key") || !options.key)) return { action: "removeItemSync", err: "No key was given "};
  if ((options.type === "array") && (!Object.keys(options).includes("index") || !options.index)) return { action: "removeItemSync", err: "No index was given "};
  try {
    fs.writeFileSync(options.path, ((options.type === "object") ? Object.entries(readFileSync({ path: options.path })).filter((item) => item[0] !== options.key).data.reduce((args, item) => ({ ...args, [item[0]]: item[1]}), {}) : readFileSync({ path: options.path }).data.filter((_, index) => index !== options.index)), 'utf8');
  } catch (err) {
    return { action: "removeItemSync", err: err.message };
  }
  return { action: "removeItemSync", path: options.path, type: options.type, [(options.type === "object") ? "key" : "index"]: (options.type === "object") ? options.key : options.index };
}

function getItem(options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "getItem", err: "No options were given" });
    if (!Object.keys(options).includes("path") || !options.path) return resolve({ action: "getItem", err: "No path was given" });
    if (!Object.keys(options).includes("type") || !options.type) return resolve({ action: "getItem", err: "No type was given" });
    if ((options.type === "object") && (!Object.keys(options).includes("key") || !options.key)) return resolve({ action: "getItem", err: "No key was given "});
    if ((options.type === "array") && (!Object.keys(options).includes("index") || !options.index)) return resolve({ action: "getItem", err: "No index was given "});
    return resolve({
      action: "getItem",
      path: options.path,
      type: options.type,
      [(options.type === "object") ? "key" : "index"]: (options.type === "object") ? options.key : options.index,
      value: readFileSync({ path: options.path }).data[(options.type === "object") ? options.key : options.index],
      database: {
        set: function (firstArg) {
          setItem({
            [(options.type === "object") ? "key" : "index"]: (options.type === "object") ? options.key : options.index,
            value: firstArg,
            type: options.type,
            path: options.path
          });
        }
      }
    });
  });
}

function getItemSync(options) {
  if (!options || Object.keys(options).length === 0) return { action: "getItem", err: "No options were given" };
  if (!Object.keys(options).includes("path") || !options.path) return { action: "getItem", err: "No path was given" };
  if (!Object.keys(options).includes("type") || !options.type) return { action: "getItem", err: "No type was given" };
  if ((options.type === "object") && (!Object.keys(options).includes("key") || !options.key)) return { action: "getItem", err: "No key was given "};
  if ((options.type === "array") && (!Object.keys(options).includes("index") || !options.index)) return { action: "getItem", err: "No index was given "};
  return {
    action: "getItem",
    path: options.path,
    type: options.type,
    [(options.type === "object") ? "key" : "index"]: (options.type === "object") ? options.key : options.index,
    value: readFileSync({ path: options.path }).data[(options.type === "object") ? options.key : options.index],
    database: {
      set: function (firstArg) {
        setItem({
          [(options.type === "object") ? "key" : "index"]: (options.type === "object") ? options.key : options.index,
          value: firstArg,
          type: options.type,
          path: options.path
        });
      }
    }
  };
}

function getDatabaseById(options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "getDatabaseById", err: "No options were given" });
    if (!Object.keys(options).includes("id") || !options.id) return resolve({ action: "getDatabaseById", err: "No id was given" });
    fs.readdir(module.exports.databases.find((item) => item.id === options.id).folder, (err, files) => {
      if (err) return resolve({ action: "getDatabaseById", err: err.message });
      return resolve({
        action: "getDatabaseById",
        name: module.exports.databases.find((item) => item.id === options.id).name,
        id: options.id,
        files: files.map((file) => ({
          name: file,
          content: readFileSync({ path: module.exports.databases.find((item) => item.id === options.id).folder + "/" + file }).data,
          set: function (firstArg, secondArg) {
            return setItem({
              [(module.exports.databases.find((item) => item.id === options.id).type === "object") ? "key" : "index"]: firstArg,
              value: secondArg,
              type: module.exports.databases.find((item) => item.id === options.id).type, 
              path: module.exports.databases.find((item) => item.id === options.id).folder + "/" + file
            });
          },
          add: (module.exports.databases.find((item) => item.id === options.id).type === "array") ? (function (firstArg) {
            return addItem({
              value: firstArg,
              type: module.exports.databases.find((item) => item.id === options.id).type, 
              path: module.exports.databases.find((item) => item.id === options.id).folder + "/" + file
            });
          }) : null,
          remove: function (firstArg) {
            return removeItem({
              [(module.exports.databases.find((item) => item.id === options.id).type === "object") ? "key" : "index"]: firstArg,
              type: module.exports.databases.find((item) => item.id === options.id).type, 
              path: module.exports.databases.find((item) => item.id === options.id).folder + "/" + file
            });
          },
          get: function (firstArg) {
            return getItem({
              [(module.exports.databases.find((item) => item.id === options.id).type === "object") ? "key" : "index"]: firstArg,
              type: module.exports.databases.find((item) => item.id === options.id).type, 
              path: module.exports.databases.find((item) => item.id === options.id).folder + "/" + file
            });
          },
          read: function () {
            return readFile({
              path: module.exports.databases.find((item) => item.id === options.id).folder + "/" + file
            });
          }
        }))
      });
    });
  });
}

function getDatabaseByIdSync(options) {
  if (!options || Object.keys(options).length === 0) return { action: "getDatabaseById", err: "No options were given" };
  if (!Object.keys(options).includes("id") || !options.id) return { action: "getDatabaseById", err: "No id was given" };
  var files;
  try {
    files = fs.readdirSync(module.exports.databases.find((item) => item.id === options.id).folder)
  } catch (err) {
    return { action: "getDatabaseById", err: err.message };
  }
  return {
    action: "getDatabaseById",
    name: module.exports.databases.find((item) => item.id === options.id).name,
    id: options.id,
    files: files.map((file) => ({
      name: file,
      data: readFileSync({ path: module.exports.databases.find((item) => item.id === options.id).folder + "/" + file }).data,
      set: function (firstArg, secondArg) {
        return setItemSync({
          [(module.exports.databases.find((item) => item.id === options.id).type === "object") ? "key" : "index"]: firstArg,
          value: secondArg,
          type: module.exports.databases.find((item) => item.id === options.id).type, 
          path: module.exports.databases.find((item) => item.id === options.id).folder + "/" + file
        });
      },
      add: (module.exports.databases.find((item) => item.id === options.id).type === "array") ? (function (firstArg) {
        return addItemSync({
          value: firstArg,
          type: module.exports.databases.find((item) => item.id === options.id).type, 
          path: module.exports.databases.find((item) => item.id === options.id).folder + "/" + file
        });
      }) : null,
      remove: function (firstArg) {
        return removeItemSync({
          [(module.exports.databases.find((item) => item.id === options.id).type === "object") ? "key" : "index"]: firstArg,
          type: module.exports.databases.find((item) => item.id === options.id).type, 
          path: module.exports.databases.find((item) => item.id === options.id).folder + "/" + file
        });
      },
      get: function (firstArg) {
        return getItemSync({
          [(module.exports.databases.find((item) => item.id === options.id).type === "object") ? "key" : "index"]: firstArg,
          type: module.exports.databases.find((item) => item.id === options.id).type, 
          path: module.exports.databases.find((item) => item.id === options.id).folder + "/" + file
        });
      },
      read: function () {
        return readFileSync({
          path: module.exports.databases.find((item) => item.id === options.id).folder + "/" + file
        });
      }
    }))
  };
}

function getDatabasesByName(options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "getDatabasesByName", err: "No options were given" });
    if (!Object.keys(options).includes("name") || !options.name) return resolve({ action: "getDatabasesByName", err: "No name was given" });
    resolve({
      action: "getDatabasesByName",
      name: options.name,
      databases: module.exports.databases.filter((database) => database.name === options.name).map((database) => {
        getDatabaseById(database.id).then((result) => {
          return Object.entries(result).filter((item) => item[0] !== "action").reduce((data, item) => ({ ...data, [item[0]]: item[1] }), {});
        });
      })
    });
  });
}

function getDatabasesByNameSync(options) {
  if (!options || Object.keys(options).length === 0) return { action: "getDatabasesByNameSync", err: "No options were given" };
  if (!Object.keys(options).includes("name") || !options.name) return { action: "getDatabasesByNameSync", err: "No name was given" };
  return {
    action: "getDatabasesByNameSync",
    name: options.name,
    databases: module.exports.databases.filter((database) => database.name === options.name).map((database) => Object.entries(getDatabaseByIdSync(database.id)).filter((item) => item[0] !== "action").reduce((data, item) => ({ ...data, [item[0]]: item[1] }), {}))
  };
}

class Database {
  constructor(options) {
    if (options.synchronous === true) {
      const result = registerDatabaseSync(options);
      this.id = result.id;
      this.name = result.name;
      this.folder = result.folder;
      this.synchronous = true;
    } else {
      registerDatabase(options).then((result) => {
        this.id = result.id;
        this.name = result.name;
        this.folder = result.folder;
        this.synchronous = false;
      });
    }
  }
  files() {
    if (this.synchronous === true) {
      return getDatabaseByIdSync(this.id);
    } else {
      return getDatabaseById(this.id);;
    }
  }
}

module.exports = {
  Database,
  readFile,
  convertToEnvironmentObject,
  isFolder,
  config,
  addItem,
  setItem,
  removeItem,
  getItem,
  registerDatabase,
  getDatabaseById,
  getDatabasesByName,
  readFileSync,
  convertToEnvironmentObjectSync,
  isFolderSync,
  configSync,
  addItem,
  setItem,
  removeItem,
  getItem,
  registerDatabaseSync,
  getDatabaseByIdSync,
  getDatabasesByNameSync
}
