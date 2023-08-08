const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
const sessions = require('express-session')
// const cookieParser = require("cookie-parser");
var cors = require('cors')



const db = require('./queries');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// app.use(cookieParser());


// Session Setup
app.use(sessions({
  
    // It holds the secret key for session
    secret: 'Your_Secret_Key',
  
    // Forces the session to be saved
    // back to the session store
    resave: true,
  
    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: true
  }))


// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

app.use(cors({origin: 'http://localhost:3000', credentials:true }));

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

// users are students and instructors

app.post('/drop',db.dropCourse);

app.post('/login',db.login); // log in present users

app.get('/home/',db.home); // info on the logged in user . is there any way to use post instead of all
// app.get('/home/registration',db.registration);
app.post('/home/register',db.registration);
app.post('/search',db.search);

app.get('/course/running/',db.getRunningCourses);

app.get('/course/running/:dept_name/',db.getRunningDeptC)

app.get('/course/:course_id/',db.getCourseById);

app.get('/instructor/:instructor_id/',db.getInstrById); // how to make this only for logged in users

// set past sem acc to data . check for sem and year ie year< cur year ....

app.get('/logout',db.logoutUser);


app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});