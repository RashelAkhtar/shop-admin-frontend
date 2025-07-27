import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from "./Components/RegisterForm";
import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
