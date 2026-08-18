import { BrowserRouter as Router } from "react-router-dom";
import renderRoutes, { routes } from "./routes";
import { AuthContextProvider } from "./contexts/AuthContext";

function App() {
  return (
    <Router basename={"/"}>
      <AuthContextProvider>
        {renderRoutes(routes)}
      </AuthContextProvider>
    </Router>
  );
}

export default App;
