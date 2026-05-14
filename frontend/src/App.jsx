import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DepartmentsPage from "./pages/DepartmentsPage";

function App() {
  return (
      <BrowserRouter>
        <nav>
          <Link to="/departments">Departments</Link>
        </nav>

        <Routes>
          <Route path="/departments" element={<DepartmentsPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;