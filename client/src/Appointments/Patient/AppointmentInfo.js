import React, { Component } from 'react'
import Service from 'src/Service';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toolbar } from 'primereact/toolbar';
import { BookingStatus } from 'src/Utils/constants';
import { Rating } from 'primereact/rating';
import LoadingComponent from 'src/LoadingComponent';
import { Toast } from 'primereact/toast';

export default class AppointmentInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rating: props.appointment.rating ? props.appointment.rating : 0,
            review: props.appointment.review ? props.appointment.review : '',
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
        const { rating, review } = this.state;

        if (!rating || !review.length) {
            this.toast.show({ severity: 'error', summary: 'Invalid', detail: 'Please give a rating and share your experience', life: 3000 });
            return
        }


        this.setState({
            isLoading: true,
        });
        const url = `/appointment/saverating`;
        this.service.post(url, {
            //   appointment: this.props.appointment._id,
            //  patient: this.props.appointment.patient,
            //  doctor: this.props.appointment.doctor._id,
            rating: this.state.rating,
            review: this.state.review,
            _id: this.props.appointment._id
        }, true).then((res) => {

            debugger
            if (res && res.status && res.res.status) {
                this.toast.show({ severity: 'success', summary: 'Success', detail: 'Booked an appointment', life: 3000 });
                this.setState({
                    isLoading: false,
                }, this.props.onRatingUpdate)


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
                    <h2 className='title2'>Problem</h2>

                    <div>
                        <span className='label-l1'> Description : </span><span className='label-v1'> {appointment.description}</span>
                    </div>

                    {appointment.status == 2 && <>
                        <div className='ma-mt10'>
                            <span className='label-l1'> Prescription by doctor :</span> <span className='label-v1'> {appointment.prescription}</span>
                        </div>
                    </>}


                    <h2 className='title2 ma-mt20'>Doctor Personal Details</h2>

                    <div>
                        <span className='label-l1'>Doctor Name :</span>  <span className='label-v1'> {appointment.doctor.name}</span>
                    </div>
                    <div>
                        <span className='label-l1'>Phone Number :</span> <span className='label-v1'>  {appointment.doctor.phoneNumber}</span>
                    </div>
                    <div>
                        <span className='label-l1'>Email :</span> <span className='label-v1'>  {appointment.doctor.email}</span>
                    </div>
                    {
                        appointment.status === 2 && <>
                            <h2 className='title2 ma-mt20'>Rating & Review </h2>
                            <Rating cancel={false} className="ma-mt10" value={this.state.rating} onChange={(e) => this.setState({ rating: e.value })} />
                            <InputTextarea placeholder="Please share your experience"
                                className="ma-w100p ma-mt10"
                                onChange={(e) => {
                                    this.setState({
                                        review: e.target.value
                                    })
                                }}


                                rows={5}
                                multiple={true}
                                value={this.state.review}
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
                    <Toast ref={(el) => this.toast = el} position="bottom-right" />

                    {
                        this.state.isLoading && <>
                            <LoadingComponent />
                        </>
                    }
                </div>
            </Dialog >
        )
    }
}
