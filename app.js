const mysql = require("mysql");

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
  orderProcess("Picture Frames 11x14", 4);
  console.log("connected as id ", connection.threadId);
});

function updateQuantity(newQuantity, name, price) {
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        quantity: newQuantity
      },
      {
        product: name
      }
    ],
    function(error, results) {
      if (error) {
        throw error;
      }
      console.log("Your total is: " + price);
      connection.end();
    }
  );
}

function orderProcess(name, quantity) {
  connection.query(
    "SELECT * FROM products WHERE ?",
    {
      product: name
    },
    function(error, results) {
      if (error) {
        throw error;
      }
      const enoughQuantity = results[0].quantity >= quantity;
      if (enoughQuantity) {
        const updatedQuantity = results[0].quantity - quantity;
        const total = results[0].price * quantity;
        updateQuantity(updatedQuantity, name, total);
      } else {
        console.log("Insufficient Quantity!");
        connection.end();
      }
    }
  );
}
