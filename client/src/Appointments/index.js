import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Authentication from '../session/index'
import LoadingComponent from 'src/LoadingComponent';
import Header from 'src/Header';
import DoctorAppointments from './Doctor';
import PatientAppointments from './Patient';



class Appointments extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentTabFor: null

        }
    }

    componentDidMount() {

        if (this.props.authenticated && this.props.authenticated) {
            this.setState({
                currentTabFor: this.props.userType
            })
        }
    }


    componentDidUpdate(prevProps) {
        if (prevProps.isSessionChecked != this.props.isSessionChecked && (this.props.isSessionChecked && !this.props.authenticated)) {
            this.props.history.push('/login')
        }
        if (prevProps.authenticated != this.props.authenticated && this.props.authenticated) {
            this.setState({
                currentTabFor: this.props.userType
            })
        }
    }

    render() {
        const { currentTabFor } = this.state;
        return (<>
            <Header>
                <div className='ma-main'>


                    <h3>My Appointments</h3>
                    {
                        currentTabFor == 'patient' && <>
                            <PatientAppointments user={this.props.user?.user} />


                        </>
                    }
                    {
                        currentTabFor == 'doctor' && <>
                            <DoctorAppointments user={this.props.user?.user} />
                        </>
                    }
                </div>
            </Header>
        </>

        )
    }
}





const mapStateToProps = (state) => ({
    user: state.user,
    userType: state?.user?.userType,
    authenticated: state?.user?.authenticated,
    isSessionChecked: state?.user?.isSessionChecked,
});


export default connect(mapStateToProps, {

})(Authentication(withRouter(Appointments)));
