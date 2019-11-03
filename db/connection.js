const mysql = require("mysql2");
  
const connection = mysql.createConnection({
  host: "",
  user: "",
  database: "",
  password: ""
});

// connection.connect(function(err){
//     if (err) {
//       return console.error("Ошибка: " + err.message);
//     }
//     else{
//       console.log("Подключение к серверу MySQL успешно установлено");
//     }
//  });
//  // закрытие подключения
//  connection.end(function(err) {
//   if (err) {
//     return console.log("Ошибка: " + err.message);
//   }
//   console.log("Подключение закрыто");
// });

module.exports = connection;