import React from "react";

const CoursesList = ({ courses }) => {
  // Group courses based on year and semester
  const coursesByYearSemester = courses.reduce((acc, course) => {
    const key = `${course.year}-${course.semester}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(course);
    return acc;
  }, {});

  const sortedKeys = Object.keys(coursesByYearSemester).sort((a, b) => {
    const [aYear, aSemester] = a.split("-");
    const [bYear, bSemester] = b.split("-");
    
    if (bYear !== aYear) {
      return bYear - aYear;
    }
    
    const semesters = ["Spring","Summer","Fall","Winter"];
    return semesters.indexOf(bSemester) - semesters.indexOf(aSemester);
  });
  console.log(sortedKeys);

  // Render each group of courses in a separate table
  return (
    <div>
      {sortedKeys.map((key) => {
        const group = coursesByYearSemester[key];
        return (
            <div>
                <h2>{key}</h2>
          <table key={key}>
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Year</th>
                <th>Semester</th>
                <th>Section</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {group.map((course) => (
                <tr key={course.course_id}>
                  <td><a href={'http://localhost:3000/course/'+course.course_id}>{course.course_id}</a></td>
                  <td>{course.year}</td>
                  <td>{course.semester}</td>
                  <td>{course.sec_id}</td>
                  <td>{course.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        );
      })}
    </div>
  );
};

export default CoursesList;
