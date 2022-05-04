import { BrowserRouter, Route } from 'react-router-dom';
import { Login } from './Login';
import Appointments from './Appointments';
import 'primeflex/primeflex.css';
import './theme.scss';
import './fonts/fonts.css';
import './App.scss'
import HomePage from './HomePage';
import BookAnAppointment from './Appointments/Patient/BookAnAppointment';

export const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div className="App">
          <Route exact path='/' component={HomePage} />
          <Route exact path='/login' component={Login} />
          {/* <Route exact path='/doctor' component={Doctor} />
          <Route exact path='/patient' component={Patient} /> */}
          <Route exact path='/appointments' component={Appointments} />
          <Route exact path='/appointment-book' component={BookAnAppointment} />



          {/* <Route exact path='/appointmentSuccess' component={AppointmentSuccess} />
          <Route exact path='/appointmentCancel' component={AppointmentCancel} />
          <Route exact path='/appointmentView' component={ViewAppointments} />
          <Route exact path='/docAppointmentCancel' component={DocAppointmentCancel} />
          <Route exact path='/patAppointmentView' component={ViewPatientAppointments} />
          <Route exact path='/feedback' component={Feedback} />
          <Route exact path='/feedbackSuccess' component={FeedbackSuccess} /> */}
        </div>
      </BrowserRouter>
    </div>
  );
}

