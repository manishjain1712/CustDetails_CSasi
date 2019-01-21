
const url = require('url');
var MongoClient = require('mongodb').MongoClient;
var settings = require('./settings');



const CONNECT_OPTIONS = {
	useNewUrlParser: true
};


const mongodbConnection = settings.mongodbServerUrl;
const mongoPathName = url.parse(mongodbConnection).pathname;
const dbName = mongoPathName.substring(mongoPathName.lastIndexOf('/') + 1);


const addUser = async (db) => {
	const count = await db
		.collection('user')
		.countDocuments({});
    const docExists = await db.collection('user').countDocuments({});
	const userexists = docExists === 0;
	console.log('Adding user details');
		await db.collection('user').insertOne({
			user: 'TechNinja',
			password: 'TechNinja@2019',
		});
		console.log('User details added');
	
};

const InsertCustomer = async (db) => {
	const count = await db
		.collection('CustomerDetails')
		.countDocuments({});
    const docExists = await db.collection('CustomerDetails').countDocuments({});
			console.log('Adding customer details');
        await db.collection('CustomerDetails').insertOne({
			Firstname: 'John',
			Surname: 'Smith',
            Postcode: 'M229AN',
            customerId: '989035566',
			address: 
                { Address1: 'No:21', Address2: 'ActonVille', 
                Address3:'Wythenshawe', City:'Manchester', country:'United Kingdom'},				
           
            Products: [
				{ ProdNum: 'A9123490874565', ProductName: 'Prod1' },
				{ ProdNum: 'B9123569867568', ProductName: 'Prod2' }
			]
        });
        
        await db.collection('CustomerDetails').insertOne({
			Firstname: 'Robert',
            Surname: 'Williams',           
            Postcode: 'M229AN',
            customerId: '989056566',
			address: 
                { Address1: 'No:19', Address2: 'ActonVille', 
                Address3:'Wythenshawe', City:'Manchester', country:'United Kingdom'},				
           
            Products: [
				{ ProdNum: 'A9123490874455', ProductName: 'Prod1' },
				{ ProdNum: 'B9123490874415', ProductName: 'Prod2' }
			]
        });
        
        await db.collection('CustomerDetails').insertOne({
			Firstname: 'John',
			Surname: 'Smith',
			Postcode: 'M229AN',
			address: 
                { Address1: 'No:21', Address2: 'ActonVille', 
                Address3:'Wythenshawe', City:'Manchester', country:'United Kingdom'},				
           
            Products: [
				{ ProdNum: 'A9123490874565', ProductName: 'Prod1' },
				{ ProdNum: 'B9123569867568', ProductName: 'Prod2' }
			]
		});
		console.log('Customer details added');
	
};

const createIndex = (db, collectionName, fields, options) =>
	db.collection(collectionName).createIndex(fields, options);

const createAllIndexes = async db => {
	const custindex = await db
		.collection('CustomerDetails')
		.listIndexes()
		.toArray();

	if (custindex.length === 1) {
		        
        await createIndex(db, 'CustomerDetails', {
			'Surname': 1,
			'PostCode': 1
        });

        await createIndex(db, 'CustomerDetails', {
			'Products.ProdNum': 1
		});
        
    }
};
	
(async () => {
	let client = null;
	let db = null;

	try {
		client = await MongoClient.connect(
			mongodbConnection,
			CONNECT_OPTIONS
		);
		
		db = client.db(dbName);
		console.log(`Successfully connected to ${mongodbConnection}`);
	} catch (e) {
		console.error(`MongoDB connection was failed. ${e.message}`);
		return;
	}
	db.listCollections({name: 'user'})
    .next(function(err, collinfo) {
        if (collinfo) {
			console.log('already exists user droping');
             db.dropCollection('user');
        }
	});

	db.listCollections({name: 'CustomerDetails'})
    .next(function(err, collinfo) {
        if (collinfo) {
			console.log('already exists CustomerDetails droping');
			 db.dropCollection('CustomerDetails');
        }
	});

	console.log('creating new db, collection and database');
	
	await db.createCollection('user');
	await db.createCollection('CustomerDetails');
	await addUser(db);
	await InsertCustomer(db);	
    await createAllIndexes(db);    
    console.log('db setup successfully');
	client.close();
})();
