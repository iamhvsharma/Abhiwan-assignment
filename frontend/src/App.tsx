import { BrowserRouter, Routes, Route } from "react-router-dom";
import SocketTest from "./pages/SocketTest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test-socket" element={<SocketTest />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
