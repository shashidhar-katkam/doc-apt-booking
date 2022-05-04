import { Button } from 'primereact/button';
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import Authentication from './../session/index';

import Header from './../Header';
import './styles.scss'
import { Card } from 'primereact/card';
class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        console.log(this.props)
        return (<>
            <Header>

                <div className='home-section1'>
                    <div className='ma-main home-section1-w'>
                        <h1>Meet The</h1>
                        <h1>Best Doctors</h1>
                        <p>Great doctor if you need your family member to get effective immediate assistance, emergency treatment or a simple consultation.</p>
                        {this.props.userType != 'doctor' && <>
                            <Button label='Book an Appointment' className='ma-mt10' onClick={() => { this.props.history.push('/appointment-book') }} />
                        </>}
                    </div>

                </div>
                <div className='home-section2'>
                    <div className='ma-main home-section2-w'>
                        <h1>Book an appointment for an in-clinic consultation</h1>
                        <p>Find experienced doctors across all specialties</p>
                        <Card title="Cardiologist" subTitle="heart and blood vessels" className='specialist-card'
                            header={() => {
                                return <>  <img alt="Card" className='img-s' src="./Images/ee.jpg" /></>
                            }}
                        >
                            {this.props.userType != 'doctor' && <>
                                <Button label='Book Now' className='' onClick={() => { this.props.history.push('/appointment-book') }} />
                            </>}
                        </Card>

                        <Card title="Neurologist" subTitle="disorders that affect the brain, spinal cord, and nerves" className='specialist-card'
                            header={() => {
                                return <>  <img alt="Card" className='img-s' src="./Images/nueral.jpg" /></>
                            }}
                        >
                            {this.props.userType != 'doctor' && <>
                                <Button label='Book Now' className='' onClick={() => { this.props.history.push('/appointment-book') }} />
                            </>}
                        </Card>

                        <Card title="Gastroenterologist" subTitle="esophagus, stomach, small intestine, colon and rectum, pancreas, gallbladder" className='specialist-card'
                            header={() => {
                                return <>  <img alt="Card" className='img-s' src="./Images/gastro.jpg" /></>
                            }}
                        >
                            {this.props.userType != 'doctor' && <>
                                <Button label='Book Now' className='' onClick={() => { this.props.history.push('/appointment-book') }} />
                            </>}
                        </Card>

                        <Card title="Orthopedic" subTitle="musculoskeletal system" className='specialist-card'
                            header={() => {
                                return <>  <img alt="Card" className='img-s' src="./Images/artho.jpeg" /></>
                            }}
                        >
                            {this.props.userType != 'doctor' && <>
                                <Button label='Book Now' className='' onClick={() => { this.props.history.push('/appointment-book') }} />
                            </>}
                        </Card>

                        <Card title="Pulmonologist" subTitle="respiratory system" className='specialist-card'
                            header={() => {
                                return <>  <img alt="Card" className='img-s' src="./Images/Pulmonologist.jpg" /></>
                            }}
                        >
                            {this.props.userType != 'doctor' && <>
                                <Button label='Book Now' className='' onClick={() => { this.props.history.push('/appointment-book') }} />
                            </>}
                        </Card>

                        <Card title="Oncologist" subTitle="cancer and provides medical care for a person diagnosed with cancer" className='specialist-card'
                            header={() => {
                                return <>  <img alt="Card" className='img-s' src="./Images/Oncologist.jpg" /></>
                            }}
                        >
                            {this.props.userType != 'doctor' && <>
                                <Button label='Book Now' className='' onClick={() => { this.props.history.push('/appointment-book') }} />
                            </>}
                        </Card>

                        <Card title="Ent Specialist" subTitle="diseases of ear, nose, and throat" className='specialist-card'
                            header={() => {
                                return <>  <img alt="Card" className='img-s' src="./Images/Ent.jpg" /></>
                            }}
                        >
                            {this.props.userType != 'doctor' && <>
                                <Button label='Book Now' className='' onClick={() => { this.props.history.push('/appointment-book') }} />
                            </>}
                        </Card>
                        <Card title="Urologist" subTitle="urinary system, which includes your kidneys, bladder, ureters" className='specialist-card'
                            header={() => {
                                return <>  <img alt="Card" className='img-s' src="./Images/Urologist.jpg" /></>
                            }}
                        >
                            {this.props.userType != 'doctor' && <>
                                <Button label='Book Now' className='' onClick={() => { this.props.history.push('/appointment-book') }} />
                            </>}
                        </Card>
                        <Card title="General Physician" subTitle="General problems" className='specialist-card'
                            header={() => {
                                return <>  <img alt="Card" className='img-s' src="./Images/physician.jpeg" /></>
                            }}
                        >
                            {this.props.userType != 'doctor' && <>
                                <Button label='Book Now' className='' onClick={() => { this.props.history.push('/appointment-book') }} />
                            </>}
                        </Card>
                    </div>

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
});


export default connect(mapStateToProps, {
})(Authentication(withRouter(HomePage)));
