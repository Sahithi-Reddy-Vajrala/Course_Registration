import React,{useState, useEffect} from 'react';
import './home.css';
import CoursesList from './coursesList';
import { useNavigate } from "react-router-dom";


const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async() => {
    const response = await fetch('http://localhost:8080/home',{
      method: 'GET',
      credentials: 'include'});
    const data = await response.json();
    // console.log("hi");
    if(data==="NoId"){
      alert("Please Login");
      return navigate("/login");
    }
    if(data==="NotStudent"){
      alert("Not a Student");
      return navigate("/course/running");
    }
    console.log(data);
    setUser(data);
      // .then(response => response.json())
      // .then(data => {
      //   console.log(data)
      //   setUser(data);
      // })
      // .catch(error => {
      //   console.error(error);
      // });
    })();
  }, []);
  const handleDrop = async (event, item) => {
    // your function to handle the drop action for the course
    console.log(item);
    const response = await fetch('http://localhost:8080/drop', {
      method: 'POST',
      credentials: 'include',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)});
      const res = await response.json();
      alert("course dropped");
      window.location.reload();

  };
  

  if(!user) {
    return <h1>Loading!</h1>;
  }

  const handleLogout = async (event) =>{
      const response = await fetch('http://localhost:8080/logout',{
        method:'GET',
        credentials:'include',});
      const data=await response.json();
      if(data==='BYE!'){
        alert('BYE!');
        return navigate("/login");
      }
  };

  

  return (
    <div>
      <button onClick={() => handleLogout()}>Logout here</button>
      {/* <h1>Welcome to Home Page {JSON.stringify(user)} </h1> */}
      <h2>Personal Info:</h2>
        <h3>ID: {user.info[0].id}</h3>
        <h3>Name: {user.info[0].name}</h3>
        <h3>Department: {user.info[0].dept_name}</h3>
        <h3>Total Credits: {user.info[0].tot_cred}</h3>

      {
        <div>
          <h3><a href={'http://localhost:3000/course/running'}>Link for Running Department</a></h3>

          <h2>Registerded courses</h2>
              <table>
                <tr>
                  <th>Course Id</th>
                  <th>Year</th>
                  <th>Semester</th>
                  <th>Section</th>
                  <th>Drop</th>
                </tr>
                {user.current_courses.map(item =>(
                <tr>
                    <td><a href={'http://localhost:3000/course/'+item.course_id}>{item.course_id}</a></td>
                    <td>{item.year}</td>
                    <td>{item.semester}</td>
                    <td>{item.sec_id}</td>
                    <td> 
                      <button onClick={(event) => handleDrop(event, item)}>
                      Drop
                      </button>
                    </td>
                    </tr>
                ))}
              </table>
        </div>
      }

      <h3><a href = {'http://localhost:3000/home/registration'}>List of Running Courses to register</a></h3>
      {/* {
        <div>{[...new Set(user.past_courses.map(course_id => course_id.year))].map(year => {
          const semesters = [...new Set(user.past_courses.filter(course_id => course_id.year === year).map(course_id => course_id.semester))];
          return (
              <div key={year}>
              <h2>{year}</h2>
              {semesters.map(semester => (
                  <table key={semester} style={{ borderCollapse: "collapse", marginBottom: "1em" }}>
                  <thead>
                      <tr>
                          <th>Semester</th>
                          <th>Course ID</th>
                          <th>Section</th>
                          <th>Grade</th>
                      </tr>
                  </thead>
                  <tbody>
                      {user.past_courses.filter(course_id => course_id.year === year && course_id.semester === semester).map(course => (
                          <tr key={user.past_courses.course_id}>
                              <td>{course.semester}</td>
                              <td>{course.course_id}</td>
                              <td>{course.sec_id}</td>
                              <td>{course.grade}</td>
                          </tr>
                      ))}
                  </tbody>
                  </table>
              ))}
              </div>
          );
          })}
      </div>
      } */}
      <h2>Past Courses</h2>
      <CoursesList courses={user.past_courses} />

      
      {/* <p>{r}</p> */}
      {/* <p>{JSON.stringify(user)} </p> */}
    </div>
  );
};

export default Home;
