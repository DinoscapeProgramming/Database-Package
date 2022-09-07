# Database Package

## Documentation
### Setup
```js
const db = require('db.json');
const Database = new db.Database({
  name: "My Database", // the name of your database
  type: "object", // the type of your database: object or array
  folder: "./databases" // the folder where your database files are stored
});
```

### Use environment file to setup
```js
const db = require('db.json');
let Database;
db.convertToEnvironmentObject({
  path: "./environment.txt" // the environment file where your options are stored
}).then((result) => {
  Database = new db.Database(result.object);
});
```

### Files
##### Get file by index
```js
let file;
Database.files().then((files) =>{
  file = files[0 /*index of your file*/]
});
```

##### Get file by name
```js
let file;
Database.files().then((files) => {
  file = files.find((file) => file.name === "database.json" /*Name of your file*/);
});
```

##### Get whole database
```js
file.read().then((content) => {
  console.log(content.data /*newest data in file*/ || file.content /*value when the files were defined*/);
});
```

##### Object databases
###### Set key to value
```js
file.set("foo" /*key*/, "bar" /*value*/).then((result) => {
  console.log(result);
});
```

###### Remove key
```js
file.remove("foo" /*key*/).then((result) => {
  console.log(result);
});
```

###### Get key
```js
file.get("foo" /*key*/).then((result) => {
  console.log(result.value);
});
```

#### Array databases
###### Add value
```js
file.add("Hello World" /*value*/).then((result) => {
  console.log(result);
});
```

###### Set index to value
```js
file.set(2 /*index*/, "db.json" /*value*/).then((result) => {
  console.log(result);
});
```

###### Remove index
```js
file.remove(2, /*index*/).then((result) => {
  console.log(result);
});
```

###### Get index
```js
file.get(1 /*index*/).then((result) => {
  console.log(result.value);
})
```

## Synchronous Documentation
### Setup
```js
const db = require('db.json');
const Database = new db.Database({
  name: "My Database", // the name of your database
  type: "object", // the type of your database: object or array
  folder: "./databases" // the folder where your database files are stored
  synchronous: true // make your database synchronous
});
```

### Use environment file to setup
```js
const db = require('db.json');
const Database = new db.Database(db.convertToEnvironmentObjectSync({
  path: "./environment.txt" // the environment file where your options are stored
}));
```

### Files
##### Get file by index
```js
const file = Database.files()[0 /*index of your file*/]
```

##### Get file by name
```js
const file = Database.files().find((file) => file.name === "database.json" /*Name of your file*/);
```

##### Get whole database
```js
console.log(file.read().data || file.content);
```

##### Object databases
###### Set key to value
```js
console.log(file.set("foo" /*key*/, "bar" /*value*/));
```

###### Remove key
```js
console.log(file.remove("foo" /*key*/));
```

###### Get key
```js
console.log(file.get("foo" /*key*/));
```

#### Array databases
###### Add value
```js
console.log(file.add("Hello World" /*value*/));
```

###### Set index to value
```js
console.log(file.set(2 /*index*/, "db.json" /*value*/));
```

###### Remove index
```js
console.log(file.remove(2, /*index*/));
```

###### Get index
```js
console.log(file.get(1 /*index*/).value);
```

## Todo
- There are currently no todos

## Disclaimer
This package is mainly promise based but also contains a synchronous function for each function. If you're using a class to register a database it will call the asynchronous version and return the result synchronously.
