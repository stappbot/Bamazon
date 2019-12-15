const mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "tH1s1sm384",
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log("connected as id ", connection.threadId);
});

function updateQuantity(newQuantity, ID, price) {
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        quantity: newQuantity
      },
      {
        id: ID
      }
    ],
    function(error) {
      if (error) {
        throw error;
      }
      console.log("Your total is: " + price);
      connection.end();
    }
  );
}

function orderProcess(ID, quantity) {
  connection.query(
    "SELECT * FROM products WHERE ?",
    {
      id: ID
    },
    function(error, results) {
      if (error) {
        throw error;
      }
      const enoughQuantity = results[0].quantity >= quantity;
      if (enoughQuantity) {
        const updatedQuantity = results[0].quantity - quantity;
        const total = results[0].price * quantity;
        updateQuantity(updatedQuantity, ID, total);
      } else {
        console.log("Insufficient Quantity!");
        connection.end();
      }
    }
  );
}

function start() {
  connection.query("SELECT * FROM products", function(error, results) {
    if (error) {
      throw error;
    }
    console.table(results);
    inquirer
      .prompt({
        name: "productID",
        type: "input",
        message: "What is the ID of the product you would like to buy?"
      })
      .then(function(data) {
        console.log("product id is: ", data.productID);

        inquirer
          .prompt({
            name: "productQuantity",
            type: "input",
            message: "How many do you want, big spender?"
          })
          .then(function(answer) {
            console.log("the product quantity is", answer.productQuantity);

            orderProcess(data.productID, answer.productQuantity);
          });
      });
  });
}
start();
