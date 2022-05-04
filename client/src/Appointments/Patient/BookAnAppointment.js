import React, { Component } from 'react'
import { Dialog } from 'primereact/dialog';
import Service from 'src/Service';
import { Toolbar } from 'primereact/toolbar';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import appointmentFields from './appointmentFields.json';
import LoadingComponent from 'src/LoadingComponent';
import { Specialization } from 'src/Utils/constants';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Authentication from '../../session/index'
import Header from 'src/Header';
import './styles.scss'
import { InputTextarea } from 'primereact/inputtextarea';

class BookAnAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //  appointment: this.formFields.data,

            // formValidations: this.formFields.formValidations,
            specialization: '',
            doctors: [],
            doctor: null,
            bookingDate: null,
            bookingSlot: null,
            description: '',
            availableSlots: [],
            slotsFetched: false


        }


        this.service = new Service();

    }

    onSepcialityChange = (e) => {

        this.setState({
            isLoading: true,
            specialization: e.value,
            doctors: [],
            doctor: null,
            bookingDate: null,
            bookingSlot: null,
            description: '',
            availableSlots: [],
            slotsFetched: false
        })

        const url = `/doctor/getDoctorsBySpecialization?specialization=${e.value}`
        this.service.get(url).then((res) => {
            debugger
            if (res && res.status && res.res.status) {

                this.setState({
                    isLoading: false,
                    doctors: res.res.data
                })

            } else {

                this.setState({
                    isLoading: false
                });
                this.toast.show({ severity: 'error', summary: 'Some error occured', detail: res.errMessage, life: 3000 });
            }

        }).catch(e => {
            console.log(e);
            this.setState({
                isLoading: false
            });
            this.toast.show({ severity: 'error', summary: 'Some error occured', detail: e.message, life: 3000 });
        })




    }



    onDoctorChange = (e) => {

        this.setState({
            doctor: e.value,
            bookingDate: null,
            bookingSlot: null,
            description: '',
            availableSlots: [],
            slotsFetched: false
        }, () => {
            this.fetchSlots()
        })



    }

    onSlotDateChange = (e) => {

        this.setState({
            bookingDate: e.value,
            bookingSlot: null,
            description: '',
            availableSlots: [],
            slotsFetched: false
        }, () => {
            this.fetchSlots()
        })

    }

    fetchSlots = (e) => {


        let { doctor, bookingDate } = this.state;

        if (!doctor || !bookingDate) {
            return;
        }



        this.setState({
            isLoading: true,
        });
        const url = `/appointment/getSlots`
        this.service.post(url, {
            "date": moment(new Date(this.state.bookingDate)).format('l'),
            "doctor": this.state.doctor
        }, true).then((res) => {

            debugger
            if (res && res.status && res.res.status) {
                this.setState({
                    isLoading: false,
                    availableSlots: res.res.data,
                    slotsFetched: true
                })

            } else {

                this.setState({
                    isLoading: false
                });
                this.toast.show({ severity: 'error', summary: 'Some error occured', detail: res.errMessage, life: 3000 });
            }

        }).catch(e => {
            console.log(e);
            this.setState({
                isLoading: false
            });
            this.toast.show({ severity: 'error', summary: 'Some error occured', detail: e.message, life: 3000 });
        })
    }

    onSlotSelect = (slot) => {

        if (slot.booked) {
            return;
        }

        this.setState({
            bookingSlot: slot.value
        });


    }

    onDescriptionChange = (e) => {
        this.setState({
            description: e.target.value
        })

    }


    bookSlot = () => {
        let { bookingDate, bookingSlot, doctor, description } = this.state;

        if (!bookingDate || !bookingSlot || !doctor || !description || !description.length) {
            this.toast.show({ severity: 'error', summary: 'Invalid', detail: 'Please enter all required fields', life: 3000 });
            return
        }
        this.setState({
            isLoading: true,
        });
        const url = `/appointment/book`
        this.service.post(url, {
            bookingDate: moment(new Date(this.state.bookingDate)).format('l'),
            bookingSlot: this.state.bookingSlot,
            doctor: this.state.doctor,
            description: this.state.description
        }, true).then((res) => {

            if (res && res.status && res.res.status) {
                this.setState({
                    isLoading: false,
                }, () => {
                    debugger

                    this.props.history.push('/appointments')
                })
            } else {
                this.setState({
                    isLoading: false
                });
                this.toast.show({ severity: 'error', summary: 'Some error occured', detail: res.errMessage, life: 3000 });
            }

        }).catch(e => {
            console.log(e);
            this.setState({
                isLoading: false
            });
            this.toast.show({ severity: 'error', summary: 'Some error occured', detail: e.message, life: 3000 });
        })




    }

    componentDidMount() {
        if (this.props.isSessionChecked && !this.props.authenticated) {
            this.props.history.push('/login')
        }

    }

    componentDidUpdate(prevProps) {
        if (prevProps.isSessionChecked != this.props.isSessionChecked && (this.props.isSessionChecked && !this.props.authenticated)) {
            this.props.history.push('/login')
        }

    }

    render() {
        const { appointment, formValidations } = this.state;

        console.log(this.state, 'state-appointment')
        return (<>
            <Header>
                <div className="ask-a-doubt ma-main">
                    <h3 className='book-an-apt-title'> Book an Appointment</h3>
                    <div className='paper-s1' style={{ marginBottom: '20px' }}>
                        <div className="p-grid ma-mt20">

                            <div className="p-col-4 p-md-2 p-lg-2">
                                <p className='text-label'>Select specialization<span className='ma-required'>*</span></p>
                            </div>
                            <div className="p-col-8 p-md-8 p-lg-8 ma-mt2">
                                <Dropdown value={this.state.specialization}
                                    className='ma-w200'
                                    options={Specialization}
                                    optionLabel='value'
                                    optionValue='key'
                                    onChange={this.onSepcialityChange}
                                    placeholder="--Select--" />
                            </div>
                        </div>
                        <div className="p-grid ">
                            <div className="p-col-4 p-md-2 p-lg-2">
                                <p className='text-label' >Doctor <span className='ma-required'>*</span></p>
                            </div>
                            <div className="p-col-8 p-md-8 p-lg-8 ma-mt2">
                                <Dropdown value={this.state.doctor}
                                    className='ma-w200'
                                    options={this.state.doctors}
                                    optionLabel='name'
                                    optionValue='_id'
                                    onChange={this.onDoctorChange}
                                    placeholder="--Select--" />
                            </div>
                        </div>
                        <div className="p-grid ">
                            <div className="p-col-4 p-md-2 p-lg-2">
                                <p className='text-label'>Date of Appointment </p>
                            </div>
                            <div className="p-col-8 p-md-8 p-lg-8 ma-mt2">
                                <Calendar value={this.state.bookingDate ? new Date(this.state.bookingDate) : new Date()}
                                    showIcon={true}
                                    placeholder='Slot Date'
                                    id='fromDatwes'
                                    onChange={this.onSlotDateChange}
                                    className='ma-w200'
                                ></Calendar>
                            </div>
                        </div>

                        {
                            this.state.slotsFetched ? <>
                                <h4 className='slot-info'>Slot Information</h4>
                                <div className="p-grid">
                                    {
                                        this.state.availableSlots.map(s => {
                                            return <div key={s.value} className={`p-slot ${s.value === this.state.bookingSlot ? 'p-active-slot' : ''} ${s.booked ? 'p-disable-slot' : ''} `} onClick={() => { this.onSlotSelect(s) }}>{s.label}</div>
                                        })
                                    }
                                </div>
                            </> : <>

                            </>
                        }
                        {
                            this.state.bookingSlot && <>
                                <div className="p-grid ma-mt10">
                                    <div className="p-col-4 p-md-2 p-lg-2">
                                        <p className='text-label'>Description</p>
                                    </div>
                                    <div className="p-col-8 p-md-8 p-lg-8 ma-mt2">
                                        <InputTextarea value={this.state.description}
                                            className='ma-w400'
                                            rows={5}

                                            placeholder='Please describe your problem.....'
                                            onChange={this.onDescriptionChange} />
                                    </div>
                                </div>
                            </>
                        }

                        <Toolbar className="ma-toolbar"
                            right={() => {
                                return (<Button label='Book Now' className='ma-m-lr10'
                                    onClick={this.bookSlot}
                                />)
                            }}

                        ></Toolbar>
                    </div>
                    <Toast ref={(el) => this.toast = el} position="bottom-right" />
                    {this.state.isLoading && <LoadingComponent />}
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

})(Authentication(withRouter(BookAnAppointment)));
