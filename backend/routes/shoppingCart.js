var express = require('express');
var router = express.Router();
var cors = require('cors')

var myConsts = require('./config/dbconfig')
const database = myConsts.connection.mysql_pool;
router.all('*', cors());

/* GET home page. */
router.get('/', function(req, res, next) {
    // console.log("req: " + JSON.stringify(req.body))
    // console.log("req item size: " +  req.body.items.length) 
    database.getConnection(function(err, connection){
        connection.query("SELECT MAX(cartId) as maxC, MAX(transactionId) as maxT FROM cart", function(err, result){
            if (err) res.send({responseCode: "404"})
            if (result.length > 0){
                // console.log("result: " + JSON.stringify(result));
                var nextCartId = result[0].maxC + 1;
                var nextTransactionId = result[0].maxT + 1;
                var insertItemsQuery, pid, q;
                var uid = req.body.items[0].userId;
                var insertTransactionQuery = "INSERT INTO transaction(transactionId, cartId, userId) VALUES (" + nextTransactionId + ", " + nextCartId + ", " + uid + ")"
                connection.query(insertTransactionQuery, function(err){
                    if (err) res.send({responseCode: "404: " + err});
                    console.log("Successful transaction insert");
                });
                for (var i = 0; i < req.body.items.length; i++){
                    pid = req.body.items[i].productId;
                    q = req.body.items[i].quantity;
                    insertItemsQuery = "INSERT INTO cart (cartId, transactionId, productId, quantity, userId, total_weight, total_cost) VALUES (" + nextCartId + ", "
                                        + nextTransactionId + ", "
                                        + pid + ", " 
                                        + q + ", "
                                        + uid + ", \
                                        (SELECT p.weight * " + q + " as 'totalWeight' FROM product p WHERE p.productId = " + pid +" LIMIT 1),\
                                        (SELECT p.cost * " + q + " as 'totalCost' FROM product p WHERE p.productId = " + pid + " LIMIT 1))";
                    connection.query(insertItemsQuery, function(err){
                        if (err) res.send({responseCode: "404: " + err});
                        console.log("Successful cart insert");
                    });
                }
                res.send({responseCode: "200"})
            }
            else {
              res.send({responseCode: "404: " + err});
            }
        });
    });
});

module.exports = router;