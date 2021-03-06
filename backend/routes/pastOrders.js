// var express = require('express');
// var router = express.Router();
// var cors = require('cors')

// const database = require('../config/dbconfig').mysql_pool;
// router.all('*', cors());

// //need name of item, quantity, total cost of same product, total cost of all products
// router.post("/", (req, res, next) => {
//   console.log("req.body: " + JSON.stringify(req.body));
//   database.getConnection(function (err, connection) {
//     console.log("userId: " + req.body.userId);
//     var cartQuery = "SELECT cartId, transactionId, SUM(total_weight) as 'total_weight', SUM(total_cost) as 'total_cost' \  FROM cart as c, (SELECT cartId as cId, transactionId as tId FROM transaction WHERE userId = " + req.body.userId + ") as d WHERE c.cartId = d.cId AND c.transactionId = d.tId GROUP BY c.cartId";
//     connection.query(cartQuery, function (err, result) {
//       if (err) throw err;
//       if (result.length > 0) {
//         result = {
//           data:
//             [
//               {
//                 orderId: 1,
//                 status: "processed",
//                 contents:
//                   [
//                     {
//                       name: "cake",
//                       quantity: 5,
//                       cost: 20
//                     },
//                     {
//                       name: "pie",
//                       quantity: 5,
//                       cost: 20
//                     }
//                   ],
//                 total_cost: 40
//               },
//               {
//                 orderId: 2,
//                 status: "processed",
//                 contents:
//                   [
//                     {
//                       name: "Brocolli",
//                       quantity: 10,
//                       cost: 20
//                     },
//                     {
//                       name: "Mango",
//                       quantity: 2,
//                       cost: 4
//                     }
//                   ],
//                 total_cost: 40
//               }
//             ]
//         }
//         res.send(result);
//       }
//       else {
//         res.send({
//           responseCode: "404",
//           reason: "User does not exist or user has no history of orders"
//         });
//       }
//     });
//   });
// });


// module.exports = router;

var express = require('express');
var router = express.Router();
var cors = require('cors')

const database = require('../config/dbconfig').mysql_pool;
router.all('*', cors());

//need name of item, quantity, total cost of same product, total cost of all products
router.post("/", (req, res, next) => {
    var uId = req.body.userId;
      database.getConnection(function(err, connection){
          var getOrderInfo = "SELECT transactionId, orderTime, cartId, status, p.productName, quantity as q, cost * quantity as 'cost' \
                              FROM (SELECT transactionId, status, cartId, orderTime FROM innodb.transaction WHERE userId = "+uId+") as t, \
                              (SELECT productId, quantity, transactionId as tId FROM innodb.cart WHERE userId = "+uId+") as c, \
                              (SELECT productId, productName, cost FROM innodb.product) as p \
                              WHERE p.productId = c.productId AND t.transactionId = c.tId ORDER BY transactionId;";

          connection.query(getOrderInfo, function(err, result){
            connection.release();
            console.log("pastOrders connection released");
            if (err) throw err;
            if (result.length > 0){
              DELIVERY_TIME_MILLISECONDS = 300000;
              for (let i = 0; i < result.length; i++) {
                if(Date.now() - result[i].orderTime > DELIVERY_TIME_MILLISECONDS) {
                  result[i].status = "Completed"
                }
                else {
                  result[i].status = "In Progress"
                }
              }
              res.send(result);
            }
          });
      });
  });

module.exports = router;