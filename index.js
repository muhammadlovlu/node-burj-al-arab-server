const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const admin = require('firebase-admin');



require('dotenv').config()
console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t838e.mongodb.net/dbBurj?retryWrites=true&w=majority`;


const port = 5000
const app = express();
app.use(cors());
app.use(bodyParser.json());





var serviceAccount = require("./node-burj-al-arab-firebase-adminsdk-qaxhu-4dfb60d5bc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});







const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookings = client.db("dbBurj").collection("Bookings");

  
  app.post('/addBooking', (req,res) => {
    const newBooking = req.body;
    bookings.insertOne(newBooking)
    .then(result => {
      res.send(result.insertedCount> 0);
    })
  })


app.get('/bookings',(req, res) => {
  const bearer = req.headers.authorization;
  if(bearer && bearer.startsWith('Bearer ')){
const idToken = bearer.split(' ')[1];
  // idToken comes from the client app
  admin
  .auth()
  .verifyIdToken(idToken)
  .then((decodedToken) => {
    const tokenEmail = decodedToken.email;

    if(tokenEmail == req.query.email){

      bookings.find({email:req.query.email})
      .toArray((err, documents)=>{
        res.status(200).send(documents);
      })
    }
    else{
      res.status(401).send('un authorize access')
    }
    
    
    // ...
  })
  .catch((error) => {
    res.status(401).send('un authorize access')
  });
console.log({idToken})
  }

else{
  res.status(401).send('un authorize access')
}


})




});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)