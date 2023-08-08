const Pool = require('pg').Pool;
const bcrypt = require("bcrypt");
const { response, request } = require('express');

const details = require('./config.txt');


const pool = new Pool({
  user: details.user,
  host: details.host,
  database: details.database,
  password: details.password,
  port: details.port,
});

// var today= new Date();
// var year1 = String(today.getFullYear());
// var month = today.getMonth();
var year;
var sem;
pool.query('Select year,semester from reg_dates where start_time<now() order by start_time DESC',(error,results)=>{
  if(error){
    throw error;
  }
  else{
    year=results.rows[0].year
    sem = results.rows[0].semester
  }
});

const semdict = {'Spring':1,'Summer':2,'Fall':3,'Winter':4};


// if (month < 6)
//   sem = "Spring";
// else
//   sem = "Fall";
// sem="Spring";
// year="2009";


// function setYearSem (){
//   pool.query('Select distinct(year,semester) from reg_dates',(error,results)=>{
//       if(error){
//         throw error;
//       }
//       else{
        
//       }
//       return "setdone"
//   });
// }


var session;

const getDepts = (request, response) => {
  pool.query('SELECT * FROM department ORDER BY dept_name ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getCoursesOfDeptById = (request, response) => {
  const dept_name = String(request.params.dept_name);

  pool.query('SELECT * FROM course WHERE dept_name = $1 ORDER BY course_id', [dept_name], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getCourses = (request, response) => {
  pool.query('SELECT * FROM course ORDER BY course_id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};



const getStudById = (request, response) => {
  const id = String(request.params.id);
  pool.query('SELECT * FROM student WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
  // pool.query('SELECT course_id, semester,year FROM takes where id = $1', [id], (error, results) => {
  //   if (error) {
  //     throw error;
  //   }
  //   response.status(200).json(results.rows);
  // });
};



const login = (request, response) => {
  // setYearSem();
  // console.log("he")
  console.log(request.body);

  const { id, password } = request.body;
  console.log(request.sessionID)
  // if(id==null || password==null) return response.redirect('/login/')

  pool.query('SELECT hashed_password FROM user_password WHERE id = $1',[id], (error, results) => {
    if (error) {
      throw error;
    }
    if(results.rowCount==0){
      console.log("not in data")
      return response.status(200).json("false");
    }
    console.log(results.rows[0].hashed_password)
    console.log(id)
    bcrypt
      .compare(password, results.rows[0].hashed_password)
      .then(res => {
        console.log(results.rows[0])
        console.log(res) // return true
        if(res){
          session=request.session
          session.userid = String(id)
          console.log(request.session)
        }
        return response.status(200).json(res)
      })
    .catch(err => console.error(err.message))
    
  });

};



// const saltRounds = 10


// bcrypt
//   .hash(password, saltRounds)
//   .then(hash => {
//           userHash = hash 
//     console.log('Hash ', hash)
//     validateUser(hash)
//   })
//   .catch(err => console.error(err.message))

// function validateUser(hash) {
//     bcrypt
//       .compare(password, hash)
//       .then(res => {
//         console.log(res) // return true
//       })
//       .catch(err => console.error(err.message))        
// }


const home = (request, response) => {
  console.log("home")
  console.log(request.session)
  console.log("sem:",sem)
  console.log("year:",year)
  const id = request.session.userid;
  request.session.type="student"
  if(!id){ 
    console.log("No id"); 
    return response.status(200).json("NoId")
  };
  // const id ="12345"
  console.log(id)

  
  pool
  .query('SELECT * FROM student WHERE id = $1', [id])
  .then(res1 => {
    // console.log(res1.rows[0])
    if(res1.rowCount==0){
      console.log("User is not a Student");
      request.session.type="faculty"
      return response.status(200).json("NotStudent");
    }
    //SELECT course_id, semester,year,sec_id,grade FROM takes where id = $1 and (year<>$3 or semester<>$2) ORDER BY year,semester DESC', [id,sem,year]
    return pool
           .query("select * from takes where (year<$2or (year=$2 and (case when semester='Spring' then 1 when semester='Summer' then 2 when semester='Fall' then 3 when semester='Winter' then 4 end)<$3)) and id=$1",[id,year,semdict[sem]])
           .then(res2=>{
              // console.log(res2.rows)
              // console.log(sem,year)
              return pool
                     .query('SELECT course_id, semester,year,sec_id,grade FROM takes where id = $1 and semester=$2 and year=$3 ORDER BY course_id ASC ', [id,sem,year])
                     .then(res3=> response.status(200).json({"info":res1.rows, "past_courses":res2.rows, "current_courses": res3.rows}))
                     .catch(e => console.error(e.stack))
            })
           .catch(e => console.error(e.stack)) 
  })
  .catch(e => console.error(e.stack))

  //   const info = pool.query('SELECT * FROM student WHERE id = $1', [id])
  //   if(!info)
  // }
  // pool.query('SELECT * FROM student WHERE id = $1', [id], (error, results) => {
  //   if (error) {
  //     throw error;
  //   }
  //   response.status(200).json(results.rows);
  // });

};

	
const registration = (request, response) => {	
  console.log(request.sessionID)	
  console.log(request.session)	
  const id = request.session.userid;
  if(!id){
    console.log("No id"); 
    return response.status(200).json("NoId")
  }
  // const id = "00128"	
  console.log(id)	
  console.log(request.body)
  const {course_id,sec_id} = request.body
  console.log(course_id,sec_id)
  pool.query('Select * from takes where id=$1 and course_id=$2 and semester=$3 and year=$4',[id,course_id,sem,year],(err,results)=>{
    if(err){
      throw err
    }
    if(results.rowCount!=0){
      return response.status(200).json({"done":"already_registered"})
    }
    else{
      //(select prereq_id from prereq where course_id=$1) except (select distinct course_id from takes where id = $2 and grade<>'F' and (year<>$3 or semester<>$4))",[course_id,id,year,sem]
      pool.query("(select prereq_id from prereq where course_id=$4) except (select course_id from takes where (year<$2 or (year=$2 and (case when semester='Spring' then 1 when semester='Summer' then 2 when semester='Fall' then 3 when semester='Winter' then 4 end)<$3)) and id=$1 and grade <> 'F' and (grade is not null))",[id,year,semdict[sem],course_id],(err,res1)=>{
        if(err){
          throw err
        }
        console.log(res1);
        if(res1.rowCount!=0){
          return response.status(200).json({"done":"PrereqNotSatisfied"});
        }
        else{
          pool.query('(select building,room_number,time_slot_id from section where course_id=$1 and sec_id=$2 and semester=$3 and year=$4) except (select building,room_number,time_slot_id from section natural join takes where id=$5 and year=$4 and semester=$3)',[course_id,sec_id,sem,year,id],(err,res2)=>{
            if(err){
              throw err;
            }
            else{
              console.log("rowCount:",res2.rowCount)
              if(res2.rowCount==0) return response.status(200).json({"done":"SlotClash"});
              else{
                pool.query('INSERT INTO TAKES VALUES ($1,$2,$3,$4,$5,$6)',[id,course_id,sec_id,sem,year,""],(err,res)=>{
                  if(err){
                    throw err
                  }
                  console.log(res)
                  return response.status(200).json({"done":"registered"})
                });
              }
            }
          });
        }
      })
    }
  })
};


const dropCourse = (request,response) => {
  const id=request.session.userid;
  // const id = "00128"
  console.log(id)
  const {course_id,semester,year,sec_id,grade} = request.body
  console.log(course_id,semester,year,sec_id,grade)
  pool.query('DELETE FROM takes where id= $1 and course_id=$2 and sec_id=$3 and semester=$4 and year=$5 and grade=$6',[id,course_id,sec_id,semester,year,grade],(err,results)=>{
    if(err){
      throw err
    }
  })
  response.status(200).json({"dropped": "true"})
};




const getInstrById = (request, response) => {
  const idu = request.session.userid;
  if(!idu){ 
    console.log("No id"); 
    return response.status(200).json("NoId")
  };
  const id = String(request.params.instructor_id);

  pool
  .query('SELECT name,dept_name FROM instructor WHERE id = $1', [id])
  .then(res1 => {
    console.log(sem,year)

    return pool
           .query('SELECT course_id, semester,year FROM teaches where id = $1 and semester=$2 and year=$3 ORDER BY course_id ASC ', [id,sem,year])
           .then(res2=>{
              console.log(res2.rows)
              console.log(sem,year)
              //'SELECT course_id, semester,year FROM teaches where id = $1 and (year<>$3 or semester<>$2) ORDER BY year,semester DESC', [id,sem,year]
              return pool
                     .query("select course_id,year,semester from teaches where (year<$2 or (year=$2 and (case when semester='Spring' then 1 when semester='Summer' then 2 when semester='Fall' then 3 when semester='Winter' then 4 end)<$3)) and id=$1",[id,year,semdict[sem]])
                     .then(res3=> response.status(200).json({"info":res1.rows, "current_courses":res2.rows, "past_courses": res3.rows}))
                     .catch(e => console.error(e.stack))
            })
           .catch(e => console.error(e.stack)) 
  })
  .catch(e => console.error(e.stack))
};

const getCourseById = (request, response) => {
  id = request.session.userid;
  console.log(id)
  if(!id){
    return response.status(200).json("NoId")
  }
  const course_id = String(request.params.course_id);
  console.log(course_id)
  
  pool
  .query('SELECT * FROM course WHERE course_id = $1', [course_id])
  .then(res1 => {
    console.log(sem,year)

    return pool
           .query('SELECT prereq_id,B.title FROM course as A,prereq,course as B WHERE A.course_id=prereq.course_id AND A.course_id=$1 AND B.course_id=prereq.prereq_id', [course_id])
           .then(res2=>{
              console.log(res2.rows)
              console.log(sem,year)
              return pool
                     .query('SELECT teaches.id,name FROM teaches,instructor where course_id = $1 and teaches.id=instructor.id and year=$2 and semester=$3', [course_id,year,sem])
                     .then(res3=> response.status(200).json({"info":res1.rows, "prereq":res2.rows, "instructor": res3.rows}))
                     .catch(e => console.error(e.stack))
            })
           .catch(e => console.error(e.stack)) 
  })
  .catch(e => console.error(e.stack))
};

const getRunningCourses = (request, response) => {
  id = request.session.userid;
  if(!id){ 
    console.log("No id"); 
    return response.status(200).json("NoId")
  };
  console.log(request)
  console.log("getRunningCourses")
  pool.query('SELECT DISTINCT dept_name FROM teaches,course WHERE teaches.course_id=course.course_id AND semester=$1 AND year=$2', [sem,year], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });



};


const getRunningDeptC = (request, response) => {

  id = request.session.userid;
  if(!id){ 
    console.log("No id"); 
    return response.status(200).json("NoId")
  };

  const dept_name = String(request.params.dept_name);

  pool.query('SELECT DISTINCT course.course_id,title FROM teaches,course WHERE teaches.course_id=course.course_id AND semester=$1 AND year=$2 AND dept_name=$3', [sem,year,dept_name], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });



};




const search = (request, response) => {	
  id = request.session.userid;
  if(!id){
    console.log("No id"); 
    return response.status(200).json("NoId");
  }
  if(request.session.type=="faculty"){ 
    console.log("faculty "); 
    return response.status(200).json("NotStudent")
  };
  var { query } = request.body;	
  console.log(query)	
  if(!query){	
    query=""	
  }	
  pool.query("SELECT DISTINCT course.course_id,title,sec_id FROM section,course WHERE section.course_id=course.course_id AND semester=$1 AND year=$2 AND ( (course.course_id ILIKE $3) OR (course.title ILIKE $3) )", [sem,year,'%'+query+'%'], (error, results) => {	
    if (error) {	
      throw error;	
    }	
    response.status(200).json(results.rows);	
  });	
};	










const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createUser = (request, response) => {
  const { name, email } = request.body;

  pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    }
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

const logoutUser = (request,response) => {
  // request.logout();
  request.session.destroy();
  return response.status(200).json("BYE!");
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getDepts,
  getCoursesOfDeptById,
  getCourses,
  getCourseById,
  getStudById,
  getInstrById,
  login,
  home,
  getRunningCourses,
  getRunningDeptC,
  dropCourse,
  registration,
  search,
  logoutUser,
};


//select * from takes where (year<$2 or (year==$2 and (case when semester='Spring' then 1 when semester='Summer' then 2 when semester='Fall' the 3 when semester='Winter' then 4)<$3))) and id=$1

