import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Running = () => {
    const [info, setInfo] = useState([]);
    const navigate = useNavigate();
    
    useEffect(()=>{
        (async()=>{
            const response = await fetch('http://localhost:8080/course/running/',{
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
            <h1>Running Departments</h1>
            <table>
                <tr>
                    <th>Department</th>
                </tr>
                {info.map(item=>(
                    <tr>
                        <td><a href={'http://localhost:3000/course/running/'+item.dept_name}>{item.dept_name}</a></td>
                    </tr>
                ))}
            </table>

            
            <h3><a href = {'http://localhost:3000/home'}>Go back to home page</a></h3>
        </div>
        
    );
};

export default Running;