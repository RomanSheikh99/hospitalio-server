const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://db_admin:nTLIUINIFOQlxmuv@cluster0.vj9ld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//middleware
app.use(cors());
app.use(express.json());

async function run() {
  try {
    await client.connect();
    const database = client.db('hospitalio');
    const serviceCollection = database.collection('service');
    const doctorCollection = database.collection('doctor');
    const cardCollection = database.collection('card');
    const appointmentCollection = database.collection('appointment');
    const reviewCollection = database.collection('review');
    const adminCollection = database.collection('admin');

    // ==========================Service Section Start======================
    //add service
    app.post('/addService', async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.json(result);
    });

    // GET service
    app.get('/service', async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //get single service
    app.get('/service/:id', async (req, res) => {
      const result = await serviceCollection.find({ _id: ObjectId(req.params.id) }).toArray();
      res.send(result);
    });

    // =====================Service Section End=================================

// ==================Doctor Section Start=========================
    
    //add doctor
    app.post('/addDoctor', async (req, res) => {
      const doctor = req.body;
      const result = await doctorCollection.insertOne(doctor);
      res.json(result);
    });

    // GET doctor
    app.get('/doctor', async (req, res) => {
      const cursor = doctorCollection.find({});
      const doctors = await cursor.toArray();
      res.send(doctors);
    });

    //get single doctor
    app.get('/doctor/:id', async (req, res) => {
      const result = await doctorCollection.find({ _id: ObjectId(req.params.id) }).toArray();
      res.send(result);
    });

  // ========================Doctor Section End=========================================
    
    
  // ================= Card Section Start ========================
    
     //add to card
     app.post('/addCard', async (req, res) => {
      const service = req.body;
      const result = await cardCollection.insertOne(service);
      res.json(result);
     });
    
    //get my card
    app.get('/card/:email', async (req, res) => {
      const result = await cardCollection.find({ userId: req.params.email }).toArray();
      res.send(result);
    });

    //delete card
    app.delete('/deleteCard/:id', async (req, res) => {
      const id = req.params.id;
      const result = await cardCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
    
    
    // ======================== Card Section End =====================

  // ================= Appointment Section Start ========================
    
     //add to Appointment
     app.post('/addAppointment', async (req, res) => {
      const service = req.body;
      const result = await appointmentCollection.insertOne(service);
      res.json(result);
     });
    
     // GET Appointment
    app.get('/getAppointment', async (req, res) => {
      const appointment = await appointmentCollection.find({}).toArray();
      res.send(appointment);
    });
    
    //get my Appointment
    app.get('/appointment/:email', async (req, res) => {
      const result = await appointmentCollection.find({ userId: req.params.email }).toArray();
      res.send(result);
    });

    //delete Appointment
    app.delete('/deleteAppointment/:id', async (req, res) => {
      const id = req.params.id;
      const result = await appointmentCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    //Update Appointment
    app.put('/updateAppointment/:id', async (req, res) => {
      const id = req.params.id;
      const updatedStatus = req.body;
      const filter = { _id: ObjectId(id)};
      appointmentCollection.updateOne(filter, {
          $set: {
            status: updatedStatus.status,
          },
        })
        .then(result => {
          res.send(result);
        });
    });
    
    
    // ======================== Appointment Section End =====================

    // ================ Review Section Start =========================

    // add review
    app.post('/giveReview', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });
    
    //get doctor review
    app.get('/review/:id', async (req, res) => {
      const result = await reviewCollection.find({ doctorId: req.params.id }).toArray();
      res.send(result);
    });


    // ================ Review Section End =========================

    // ================== Admin Section Start ==========================

    //Make Admin
    app.post('/makeAdmin', async (req, res) => {
      const admin = req.body;
      const result = await adminCollection.insertOne(admin);
      res.json(result);
    });

    // GET Admin
    app.get('/admin', async (req, res) => {
      const cursor = adminCollection.find({});
      const admins = await cursor.toArray();
      res.send(admins);
    });

    // ================ Admin Section End===============================

  
  } finally {
    // await client.close();
  }
};

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('hospitalio server is Runinggggg!');
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
