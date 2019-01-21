
const services = require('./Services');
const express = require('express');
const custapp = express();
var cors = require('cors');
var CircularJSON = require('circular-json');


custapp.use(cors());
custapp.get('/logon', (req, res) =>
{
        var user_id = req.param('user');
        var password = req.param('password');
            services.IsAuthenticated(user_id, password).then(

               result => {res.send(result.data);
               console.log(result.data + "received from db");
               });
    }
)

custapp.get('/customersearch', (req, res) =>
{
    var surname = req.param('Surname');
    var PostCode = req.param('PostCode');
    services.getCustomers(surname, PostCode).then(
        result=>
        {
            res.send(CircularJSON.stringify(result));
        }
  );
}
)

custapp.get('/Productsearch', (req, res) =>
{
    var prodNum = req.param('ProductNum');
    services.getCustomersbyProdNum(prodNum).then(
        result=>
        {
            res.send(CircularJSON.stringify(result));
        }
  );
}
)



custapp.listen(3001);
