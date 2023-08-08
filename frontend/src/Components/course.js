import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Course = ()=>{
    const [course, setCourse] = useState();
    let { course_id } = useParams();
    const navigate = useNavigate();

    console.log(course_id);
    useEffect(()=>{
        (async() => {
            const response = await fetch('http://localhost:8080/course/'+course_id,{
                method:'GET',
                credentials:'include'});

            const data = await response.json();
            console.log(data);
            setCourse(data);
        })();
    },[course_id]);


    if(!course){
        return <h1>Loading!</h1>;
    }

    if(course==="NoId"){
        alert("Please Login");
        return navigate("/login");
    }
    console.log(course)

    return(
        <div>
            <h1>Course Info of {course.info[0].title}</h1>
            <h3>Course Name: {course.info[0].title}</h3>
            <h3>Course ID : {course.info[0].course_id}</h3>
            <h3>Department : {course.info[0].dept_name}</h3>
            <h3>Credits : {course.info[0].credits}</h3>
            {
               <div>
                    <h2>prereq</h2>
                    <table>
                        <tr>
                            <th>prereq_id</th>
                            <th>title</th>
                        </tr>
                        {course.prereq.map(item =>(
                            <tr>
                                <td><a href = {'http://localhost:3000/course/'+item.prereq_id}>{item.prereq_id}</a></td>
                                <td>{item.title}</td>
                            </tr>
                        ))}
                    </table>
               </div>
            }
            {
               <div>
                    <h2>Instructors</h2>
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                        {course.instructor.map(item =>(
                            <tr>
                                <td><a href = {'http://localhost:3000/instructor/'+item.id} >{item.id}</a></td>
                                <td>{item.name}</td>
                            </tr>
                        ))}
                    </table>
               </div>
            }

            <h3><a href = {'http://localhost:3000/home'}>Go back to home page</a></h3>
        </div>
    );

};

export default Course;