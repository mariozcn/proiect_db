import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

function DepartmentsPage() {

    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        axiosClient.get("/departments")
            .then(response => setDepartments(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Departments</h1>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Phone</th>
                </tr>
                </thead>
                <tbody>
                {departments.map(dep => (
                    <tr key={dep.id}>
                        <td>{dep.id}</td>
                        <td>{dep.name}</td>
                        <td>{dep.location}</td>
                        <td>{dep.phone}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default DepartmentsPage;