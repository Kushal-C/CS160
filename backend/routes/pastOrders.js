var express = require('express');
var router = express.Router();
var cors = require('cors')

const database = require('./server_constants').mysql_pool;
router.all('*', cors());

router.get("/", (req, res, next) => {
    console.log("req.body: " + JSON.stringify(req.body));
      database.getConnection(function(err, connection){
          //have to replace userId = 1 with the current user's userId
          var sql = "SELECT * FROM cart as c, (SELECT cartId FROM transaction WHERE userId = 1) as d WHERE c.userId = d.cartId";
          connection.query(sql, function(err, result, fields){
              if (err) throw err;
              if (result.length > 0){
                console.log("result: " + JSON.stringify(result));
                res.send(JSON.stringify(result));
                //res.send(result);
            }
              else {
                res.send({responseCode: "404"});
            }
          });
      });
  
  });

module.exports = router;  