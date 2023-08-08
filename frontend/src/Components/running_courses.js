import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const RunningCourses = () => {
    const [info, setInfo] = useState([]);
    const navigate = useNavigate();
    let { dept_name } = useParams();
    
    useEffect(()=>{
        (async()=>{
            const response = await fetch('http://localhost:8080/course/running/'+dept_name,{
                method:'GET',
                credentials: 'include'});

            const data = await response.json();
            console.log(data);
            setInfo(data);
        })();
    },[]);

    if(!info){
        return <h1>Loading!</h1>;
    }

    if(info==="NoId"){
        alert("Please Login");
        return navigate("/login");
    }
    console.log(info);
    return(
        <div>
            <h1>Running Courses</h1>
            <table>
                <tr>
                    <th>Course_id</th>
                    <th>Title</th>
                </tr>
                {info.map(item=>(
                    <tr>
                        <td><a href={'http://localhost:3000/course/'+item.course_id}>{item.course_id}</a></td>
                        <td>{item.title}</td>
                    </tr>
                ))}
            </table>

            <h3><a href = {'http://localhost:3000/home'}>Go back to home page</a></h3>
        </div>
    );
};

export default RunningCourses;