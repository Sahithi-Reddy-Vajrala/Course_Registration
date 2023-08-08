import './App.css';
import { BrowserRouter ,Route, Routes} from "react-router-dom";
import Login from './Components/login';
import Home from './Components/home';
import Instructor from './Components/instructor';
import Course from './Components/course';
import Registration from './Components/reg';
import Running from './Components/running';
import RunningCourses from './Components/running_courses';


function App() {
  return (
    <div>
        <Routes>
            <Route exact path={"/login"} element = {<Login/>}/>
            <Route exact path={"/"} element = {<Login/>}/>
            <Route exact path={"/home"} element = {<Home/>}/>
            <Route exact path={"/course/:course_id"} element={<Course/>}/>
            <Route exact path = {"/instructor/:instructor_id"} element={<Instructor/>}/>
            <Route exact path={"/home/registration"} element = {<Registration/>}/>
            <Route exact path={"/course/running"} element = {<Running/>}/>
            <Route exact path={"/course/running/:dept_name"} element = {<RunningCourses/>}/>
        </Routes>
    </div>    
  );
}

export default App;
