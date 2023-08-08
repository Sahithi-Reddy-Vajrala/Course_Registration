import React,{useState, useEffect,useRef} from 'react';
import './reg.css';
import { useNavigate } from "react-router-dom";
var groupBy = require('lodash.groupby')


const Registration = () => {
  const [query, setQuery] = useState("");
  const [info, setInfo] = useState([]);
  // const selectRef = useRef(); 
  const navigate = useNavigate();


//   const fetchInfo = () => {
//     return fetch('http://localhost:8080/search', {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//         'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({"query":""})})
//           .then((response) => response.json())
//           .then((info) => setInfo(info));
//   }

//   useEffect(() => {
//     fetchInfo();
//   },[])

  useEffect(() => {
    (async() => {
    const response = await fetch('http://localhost:8080/search',{
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({"query":""})})
    const res = await response.json();
    if(res==="NoId"){
      alert("Please Login");
      return navigate("/login");
    }
    if(res==="NotStudent"){
      alert("Not a Student");
      return navigate("/course/running");
    }
    const groupedres = groupBy(res, re => re.course_id);
    setInfo(groupedres);
    console.log("info",groupedres);
    })();
  }, []);




  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform authentication here
    const data = { "query":query };
    console.log(data)
    const response = await fetch('http://localhost:8080/search', {
        method: 'POST',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)});
        const dat = await response.json();
        const groupeddat = groupBy(dat, da => da.course_id);
    
        setInfo(groupeddat);
        console.log(groupeddat);
    return;
    
  };  

  const handleRegister = async (id) => {
    // event.preventDefault();
    // Perform authentication here
    const sec_id = document.getElementById(id).value
    const data = {"course_id":id,"sec_id":sec_id};
    console.log(data)
    const response = await fetch('http://localhost:8080/home/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)});
    const res = await response.json();
    console.log(res)
    if(res["done"]==="registered"){
      alert("Registered for the Course");
      window.location.reload();
    }
    if(res["done"]==="PrereqNotSatisfied"){
      alert("Prerequisites are not satisfied");
    }
    if(res["done"]==="already_registered") alert("Already Registered for the course");
    return;
    
  };

  if(!info){
    return <h1>Loading!</h1>
  }

  if(info==="NoId"){
    alert("Please Login");
    return navigate("/login");
  }

  // const handleRegister = async (id)=>{
  //   const sec_id = document.getElementById(id).value
  //   console.log("sec_id",sec_id)
  //   console.log("item",id);
  //   const data = 
  //   // console.log("key",sec_id)
  // };

  // console.log(info)

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="query">Input:</label>
        <input
          type="text"
          id="query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>

      </div>

              
      <h1>Available courses</h1>
      {/* <p>{JSON.stringify(info)}</p>  */}
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Course ID</th>
                                    <th>Course Title</th>
                                    <th>Sections</th>
                                    <th>Register</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(info).map(id=>(
                                            <tr>
                                            <td><a href={'http://localhost:3000/course/'+info[id][0].course_id}>{info[id][0].course_id}</a></td>
                                            <td>{info[id][0].title}</td>
                                            <td>
                                              <select id={id}>
                                                {
                                                  info[id].map(item=>(
                                                    <option key={item.sec_id} value={item.sec_id}>{item.sec_id}</option>
                                                  ))
                                                }

                                              </select>

                                            </td>
                                            <td> <button type="button" onClick={(event)=>handleRegister(id)}>Register</button> </td>
                                            </tr>   
                                ))}
                            </tbody>
                        </table>
                    </div>
                <h3><a href = {'http://localhost:3000/home'}>Go back to home page</a></h3>
      </form>

      

  );
};



export default Registration;
