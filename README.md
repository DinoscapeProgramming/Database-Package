# Database Package

## Documentation
### Setup
```js
const db = require('db.json');
const Database = new db.Database({
  name: "My Database", // the name of your database
  type: "object", // the type of your database: object or array
  folder: "./databases", // the folder where your database files are stored
});
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
console.log(file.read().content || file.content);
```

##### Object databases
###### Set key to value
```js
file.set("foo" /*key*/, "bar" /*value*/);
```

###### Remove key
```js
file.remove("foo" /*key*/);
```

###### Get key
```js
file.get("foo" /*key*/);
```

#### Array databases
###### Add value
```js
file.add("Hello World" /*value*/);
```

###### Set index to value
```js
file.set(2 /*index*/, "db.json" /*value*/);
```

###### Remove index
```js
file.remove(2, /*index*/);
```

###### Get index
```js
console.log(file.get(1 /*index*/).value);
```

## Todo
- Implement the `getDatabasesByName` function to get all databases with the same name in an array
- Import options from `dotenv` based file

## Disclaimer
This package is mainly promise based but also contains a synchronous function for each function. If you're using a class to register a database it will call the asynchronous version and return the result synchronously.
