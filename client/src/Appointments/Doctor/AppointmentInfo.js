import React, { Component } from 'react'
import Service from 'src/Service';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toolbar } from 'primereact/toolbar';
import { BookingStatus } from 'src/Utils/constants';
import LoadingComponent from 'src/LoadingComponent';
import { Toast } from 'primereact/toast';


export default class AppointmentInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            statusMessage: null,
            status: null,
            prescription: ''
        }
        this.service = new Service();
    }




    onStatusChange = (e) => {

        this.setState({
            statusMessage: e.value,
            status: BookingStatus[e.value]
        })



    }

    updateStatus = () => {

        const { statusMessage, prescription } = this.state;

        if (!statusMessage) {
            this.toast.show({ severity: 'error', summary: 'Invalid', detail: 'Please select status', life: 3000 });
            return
        }

        if (statusMessage && statusMessage == 'Visited' && !prescription.length) {
            this.toast.show({ severity: 'error', summary: 'Invalid', detail: 'Please write prescription', life: 3000 });
            return
        }


        this.setState({
            isLoading: true,
        });
        const url = `/appointment/update`;
        this.service.post(url, {
            statusMessage: this.state.statusMessage,
            status: this.state.status,
            prescription: this.state.prescription,
            _id: this.props.appointment._id
        }, true).then((res) => {

            debugger
            if (res && res.status && res.res.status) {
                this.setState({
                    isLoading: false,
                }, this.props.onStatusChange)

                //    this.toast.show({ severity: 'success', summary: 'Success', detail: 'Booked an appointment', life: 3000 });
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



    render() {
        const { appointment } = this.props;


        return (
            <Dialog header={'Appointment Details'}
                blockScroll={true} draggable={false}
                closeOnEscape={true}
                dismissableMask={true} visible={true}
                closable={true}
                style={{ width: '50%' }}
                onHide={this.props.onHide}>
                <div className='appointment-info'>
                    <div>
                        <span className='label-l1'>   Name : </span><span className='label-v1'> {appointment.patient.name}</span>
                    </div>

                    <div>
                        <span className='label-l1'>   Problem :</span><span className='label-v1'> {appointment.description}</span>
                    </div>
                    {appointment.status == 2 && <>
                        <div className='ma-mt10'>
                            <span className='label-l1'> Prescription given :</span> <span className='label-v1'> {appointment.prescription}</span>
                        </div>
                    </>}

                    <h3>Patient Personal Details</h3>
                    <div>
                        <span className='label-l1'> Gender : </span><span className='label-v1'>{appointment.patient.gender}</span>
                    </div>

                    <div>
                        <span className='label-l1'>  Address :</span><span className='label-v1'> {appointment.patient.address}</span>
                    </div>
                    <div>
                        <span className='label-l1'>   Phone Number : </span><span className='label-v1'>{appointment.patient.phoneNumber}</span>
                    </div>
                    <div>
                        <span className='label-l1'>    Email :</span><span className='label-v1'> {appointment.patient.email}</span>
                    </div>
                    {
                        appointment.status === 2 && <>
                            <h2 className='title2 ma-mt20'>Rating & Review </h2>
                            <Rating cancel={false} className="ma-mt10" value={appointment.rating} />
                            <InputTextarea placeholder="Please share your experience"
                                className="ma-w100p ma-mt10"
                                disabled
                                rows={5}
                                multiple={true}
                                value={appointment.review}
                                style={{ outline: 'none', border: 'none' }}
                            />

                            <Toolbar className="ma-toolbar"
                                right={() => {
                                    return (<Button label='Submit' className='ma-m-lr10'
                                        onClick={this.updateStatus}
                                    />)
                                }}

                            ></Toolbar>
                        </>
                    }


                    {
                        appointment.status === 1 && <>
                            <h2 className='update-status'>Update Status</h2>
                            <p className='ma-label-s1  ma-no-pm'>Status </p>
                            <Dropdown value={this.state.statusMessage}
                                className='ma-w200'
                                options={[{ label: 'Cancel', value: 'Cancelled' },
                                { label: 'Visited', value: 'Visited' }
                                ]}

                                onChange={this.onStatusChange}
                                placeholder="--Select--" />
                            <div className='ma-mt10'>
                                {
                                    this.state.statusMessage == 'Visited' && <>
                                        <p className='ma-label-s1  ma-no-pm'>Prescription </p>
                                        <InputTextarea placeholder="Please write prescription"
                                            className="ma-w400"
                                            onChange={(e) => {
                                                this.setState({
                                                    prescription: e.target.value
                                                })
                                            }}

                                            rows={5}
                                            multiple={true}
                                            value={this.state.prescription}
                                        />
                                    </>}
                            </div>
                            <Toolbar className="ma-toolbar"
                                right={() => {
                                    return (<Button label='Update Status' className='ma-m-lr10'
                                        onClick={this.updateStatus}
                                    />)
                                }}

                            ></Toolbar>
                        </>
                    }
                    <Toast ref={(el) => this.toast = el} position="bottom-right" />

                    {
                        this.state.isLoading && <>
                            <LoadingComponent />
                        </>
                    }
                </div>
            </Dialog>
        )
    }
}
