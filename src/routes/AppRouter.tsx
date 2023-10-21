import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../views/Home/Home";
import Navbar from "../views/Navbar/Navbar";
import Login from "../views/Login/Login";
import Register from "../views/Form/Register";
import HotelList from "../views/Hotel/HotelList";
import RoomList from "../views/Room/RoomList";
import ReservationList from "../views/Reservation/ReservationList";

const AppRouter: React.FC = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <>
          <div className="container-fluid">
            <div className="row no-gutters">
              <Navbar />
              <Route path="/" exact component={Home} />
              <Route path="/login" exact component={Login} />
              <Route path="/register" exact component={Register} />
              <Route path="/hotels" exact component={HotelList} />
              <Route path="/rooms" exact component={RoomList} />
              <Route path="/reservations" exact component={ReservationList} />
            </div>
          </div>
        </>
      </Switch>
    </Router>
  );
};

export default AppRouter;
