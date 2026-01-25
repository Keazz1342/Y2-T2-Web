var c = require("color");
var colors = require("loadash.colors");
var array = colors(['red', 'green', 'blue']);

console.log(c.red("This is red text"));
console.log(c.green("This is green text"));
console.log(c.blue("This is blue text"));
console.log("Available colors:", array);
console.log("Number of colors available:", colors.size());
