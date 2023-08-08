import React, { useState } from 'react';
import './login.css';
import { useNavigate } from "react-router-dom";
// import { useCookies } from 'react-cookie';



const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  // const [cookies, setCookie] = useCookies(["userid"])


  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform authentication here
    console.log('Username:', username);
    console.log('Password:', password);

    const data = { "id":username, "password":password };
    console.log(data)

    if(!username || !password){
      alert("Invalid Credentials");
      return navigate("/login");
    }
    const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)});
    const res = await response.text();
    console.log(res);
    if(res==="true"){
      alert("Logged in")
      return navigate("/home");
    }
    else{
      alert("Login failed")
      return navigate("/login");
    }
    
    
    
    // fetch('http://localhost:8080/login', {
    //     method: 'POST',
    //     headers: {
    //     'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // }).then(response => {
    //         console.log(response)
    //         alert("res")
    //         return response.json()})
    //   .then(res =>  {
    //         console.log(res)
    //         alert("hey")
    //         if(res==="true") alert("Success");
    //         else if(res==="false") alert("Login Failed");
    //         console.log('Success:', res);
    //   }).catch(error => {
    //     console.error('Error:', error);
    //     alert("error ${res}");
        
    //     });

  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
