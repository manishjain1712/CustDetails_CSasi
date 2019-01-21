
const url = require('url');
const MongoClient = require('mongodb').MongoClient;
const settings = require('./settings');


const mongodbConnection = settings.mongodbServerUrl;
const mongoPathName = url.parse(mongodbConnection).pathname;
const dbName = mongoPathName.substring(mongoPathName.lastIndexOf('/') + 1);

const RECONNECT_INTERVAL = 1000;
const CONNECT_OPTIONS = {
	reconnectTries: 3600,
	reconnectInterval: RECONNECT_INTERVAL,
	useNewUrlParser: true
};

const onClose = () => {
	console.log('MongoDB connection was closed');
};

const onReconnect = () => {
	console.log('MongoDB reconnected');
};

let db = null;


const connectWithRetry = () => {
	MongoClient.connect(
		mongodbConnection,
		CONNECT_OPTIONS,
		(err, client) => {
			if (err) {
				console.log(
					`MongoDB connection was failed: ${err.message}`,
					err.message
				);
				setTimeout(connectWithRetry, RECONNECT_INTERVAL);
			} else {
				db = client.db(dbName);
				if(db == null)
				{
					console.log('MongoDB null object');

				}
				db.on('close', onClose);
				db.on('reconnect', onReconnect);
				console.log('MongoDB connected successfully');
			}
		}
	);
};

connectWithRetry();

const getCustomers = (surname, postcode) => {	

	filter = { $and: [ { Surname: surname }, { Postcode: postcode } ] };
	
	return Promise.all([
		
		db
			.collection('CustomerDetails')
			.find(filter).toArray(),
			db.collection('CustomerDetails').countDocuments(filter)
	]).then(([custdetails, customersCount]) => {
		
		console.log('MongoDB collecting customer data');
			if( customersCount > 0)
			{
			

				console.log("customer found")
			}
			else
			{
				console.log("customer not found")
			}
		
		return custdetails;
	});
}


const getCustomersbyProdNum = (ProdNum) => {
	
		filter = { 'Products.ProdNum':ProdNum };
		return Promise.all([
			
			db
				.collection('CustomerDetails')
				.find(filter).toArray(),
                db.collection('CustomerDetails').countDocuments(filter)
		]).then(([custdetails, customersCount]) => {
			
			if( customersCount > 0)
			{

				console.log("customer found")
			}
			else
			{
				console.log("customer not found")
			}
			return custdetails;
		});
	}

const IsAuthenticated = (username, password) => {


	
	filter = { $and: [ { user: username }, { password: password } ] };
	console.log("user " + username + "pwd" + password);
	
	return Promise.all([
		
		db
			.collection('user')
			.find(filter),
			db.collection('user').countDocuments(filter)
	]).then(([users, userscount]) => {
		if(userscount > 0)
		{
			console.log('MongoDB collecting data success');
			const result = {
				data: 'true'
			};
			return result;
		}
		else
		{
			console.log('MongoDB collecting data failed');
			const result = {
				data: 'false'
			};
			return result;
			
		}
	});
	}

	module.exports.getCustomers = getCustomers;
	module.exports.IsAuthenticated = IsAuthenticated;
	module.exports.getCustomersbyProdNum = getCustomersbyProdNum;