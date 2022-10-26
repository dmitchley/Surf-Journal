// jwt private routes
import PrivateRoutes from "./utils/PrivateRoutes";

//config files
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";

import "./css/style.css";

import "./components/charts/ChartjsConfig";

// Import pages
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import Journal from "./pages/Journal";
import Register from "./pages/Register";
import Koelbay from "./pages/spots/KoelBay";
import Bikini from "./pages/spots/BikiniBeach";
import { setAuthToken } from "./pages/SetAuthToken";
import JournalDetail from "./pages/JournalDetail";
import AccountPage from "./pages/AccountPage";

function App() {
  //check jwt token
  const token = localStorage.getItem("token");
  if (token) {
    setAuthToken(token);
  }

  return (
    <>
      <Router>
        <Routes>
          {/* routes you have to be logged in */}
          <Route element={<PrivateRoutes />}>
            <Route element={<Dashboard />} path="/" exact />
            <Route element={<Bikini />} path="/bikinibeach" />
            <Route element={<Koelbay />} path="/koelbay" />
            <Route element={<Journal />} path="/journal" />
            <Route element={<AccountPage />} path="/account" />
            <Route element={<JournalDetail />} path="/journal:id" />
          </Route>
          {/* public routes */}
          <Route element={<Register />} path="/register" />
          <Route element={<SignIn />} path="/signin" />
        </Routes>
      </Router>
    </>
  );
}

export default App;
