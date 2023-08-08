import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import InstrCoursesList from "./instructorCourse";

const Instructor = ()=>{
    const [instructor, setInstructor] = useState();
    let { instructor_id } = useParams();
    const navigate = useNavigate();

    console.log(instructor_id);
    useEffect(()=>{
        (async() => {
            const response = await fetch('http://localhost:8080/instructor/'+instructor_id,{
                method:'GET',
                credentials:'include'});

            const data = await response.json();
            console.log(data);
            setInstructor(data);
        })();
    },[instructor_id]);


    if(!instructor){
        return <h1>Loading!</h1>;
    }

    if(instructor==="NoId"){
        alert("Please Login");
        return navigate("/login");
    }



    console.log(instructor)

    return(
        <div>
            <h1>Instructor Info of {instructor.info[0].name}</h1>
            <h3>Name: {instructor.info[0].name}</h3>
            <h3>Department : {instructor.info[0].dept_name}</h3>
            {
               <div>
                    <h2>Current Courses</h2>
                    <table>
                        <tr>
                            <th>course_id</th>
                            <th>semester</th>
                            <th>year</th>
                        </tr>
                        {instructor.current_courses.map(item =>(
                            <tr>
                                <td><a href = {'http://localhost:3000/course/'+item.course_id}>{item.course_id}</a></td>
                                <td>{item.semester}</td>
                                <td>{item.year}</td>
                            </tr>
                        ))}
                    </table>
               </div>
            }
            {/* {
               <div>
                    <h2>Past Courses</h2>
                    <table>
                        <tr>
                            <th>course_id</th>
                            <th>semester</th>
                            <th>year</th>
                        </tr>
                        {instructor.past_courses.map(item =>(
                            <tr>
                                <td><a href = {'http://localhost:3000/course/'+item.course_id}>{item.course_id}</a></td>
                                <td>{item.semester}</td>
                                <td>{item.year}</td>
                            </tr>
                        ))}
                    </table>
               </div>
            } */}

        <h2>Past Courses</h2>
        <InstrCoursesList courses={instructor.past_courses} />

        <h3><a href = {'http://localhost:3000/home'}>Go back to home page</a></h3>
        </div>
    );

};

export default Instructor;