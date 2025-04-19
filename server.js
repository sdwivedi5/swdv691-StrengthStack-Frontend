const express = require('express');

 const cors = require('cors');

 const bodyParser = require('body-parser');

 const path = require('path');

const {

  Client

 } = require('pg');



 // Database Connection Setup

 const client = new Client({

  user: 'strengthstack_app',

  host: 'database-1-instance-1.cxqgw6yi0upa.us-east-2.rds.amazonaws.com',

  database: 'postgres',

  password: 'Renuka2711',

  port: 5432,

         search_path:'strengthstack_schema'

 });





 client.connect((err) => {

  if (err) {

  console.error('Database connection error', err.stack);

  } else {

  console.log('Connected to database');

  }

 });





 // *** Sample User Data (Temporary - REMOVE LATER!) ***

 const sampleUsers = [

  { username: 'testuser', password: 'testpassword' }

 ];



 const userRoutes = require('/home/ec2-user/StrengthStack/backend/src/routes/userRoutes');

 const workoutRoutes = require('/home/ec2-user/StrengthStack/backend/src/routes/workoutRoutes');

 const exerciseRoutes = require('/home/ec2-user/StrengthStack/backend/src/routes/exerciseRoutes');

 const progressRoutes = require('/home/ec2-user/StrengthStack/backend/src/routes/progressRoutes');





 const app = express();

 const port = process.env.PORT || 3000;





 app.use(cors());

 app.use(bodyParser.json());





const frontendPath = path.join(__dirname, '.', '');

console.log('Serving static files from:', frontendPath);

app.use(express.static(frontendPath));



 app.use('/users', userRoutes);

 app.use('/workouts', workoutRoutes);

 app.use('/exercises', exerciseRoutes);

 app.use('/progress', progressRoutes);





 // Basic Error Handling

 app.use((err, req, res, next) => {

  console.error(err.stack);

  res.status(500).send({ error: err.message });

 });





 app.listen(port, () => {

  console.log(`Server listening on port ${port}`);

 });



