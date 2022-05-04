import React, { Component } from 'react'
import BookAnAppointment from './BookAnAppointment';
import { Button } from 'primereact/button';
import Service from 'src/Service';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Authentication from '../../session/index'
import { BasicLazyParams } from 'src/Utils/constants';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';
import moment from 'moment';
import { getTimeSlotByKey } from 'src/Utils';
import { Specialization } from 'src/Utils/constants';
import AppointmentInfo from './AppointmentInfo';



class PatientAppointments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowBookAppointment: false,
            appointments: [],
            lazyParams: { ...BasicLazyParams, sortField: 'bookingSlot', sortOrder: 1 },
            globalSearch: '',
            isShowAppointment: false,
            appointment: null,
            currentFilter: 1,
        }
        this.service = new Service();
    }


    showBookAnAppointment = () => {
        //this.setState({ isShowBookAppointment: true });
        this.props.history.push('/appointment-book')

    }


    onChangeStatusType = (currentFilter) => {
        this.setState((prevState) => {
            return {

                currentFilter: currentFilter,
                lazyParams: BasicLazyParams
            }
        }, this.getAppointments);
    }


    onGlobalSearch = (e) => {
        this.setState((prevState) => {
            return {

                globalSearch: e.target.value,
                lazyParams: BasicLazyParams
            }
        }, this.getAppointments);
    }

    onPage = (event) => {

        this.setState((prevState) => {

            return {
                lazyParams: {
                    ...prevState.lazyParams,
                    ...event
                }
            };
        }, this.getAppointments);
    }

    onSort = (event) => {

        this.setState((prevState) => {

            return {
                lazyParams: {
                    ...prevState.lazyParams,
                    ...event
                }
            };
        }, this.getAppointments);
    }

    onFilter = (event) => {

        event['first'] = 0;
        this.setState((prevState) => {

            return {
                lazyParams: {
                    ...prevState.lazyParams,
                    filters: event.filters
                }
            };
        }, this.getAppointments);
        //  this.setState({ lazyParams: event }, this.getOrganizations);
    }



    getAppointments = () => {
        let { lazyParams, globalSearch } = this.state;

        this.setState({
            isLoading: true,
            appointments: []
        });
        const url = `/appointment/patient?limit=${lazyParams.rows}&page=${lazyParams.page + 1}&search=${globalSearch}${lazyParams.sortField ? `&sort=${lazyParams.sortOrder == 1 ? '' : '-'}${lazyParams.sortField}` : ''}`;
        this.service.post(url, { status: this.state.currentFilter }, true).then((res) => {

            debugger
            if (res && res.status && res.res.status) {
                this.setState({
                    isLoading: false,
                    appointments: res.res.data,
                    totalRecords: res.res.totalRecords
                })

                this.toast.show({ severity: 'success', summary: 'Success', detail: 'Booked an appointment', life: 3000 });
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

    showAppointment = (appointment) => {

        this.setState({
            isShowAppointment: true,
            appointment: appointment
        })
    }


    actionsTemplate = (rowData) => {
        return (<>
            <div className="p-d-flex ma-mlr10 user-edit-t">
                <span data-pr-tooltip="View Appointment" data-pr-position="bottom" className={`ma-ml10 anal${rowData._id.substr(4)}`} onClick={() => this.showAppointment(rowData)} >
                    <i className='pi pi-eye' />
                </span>
                <Tooltip className="table-li-tooltip2" autoHide={false} target={`.anal${rowData._id.substr(4)}`} />
            </div>
        </>
        );
    }

    exportCSV = () => {
        this.dt.exportCSV();
    }


    onRatingUpdate = () => {

        this.setState({
            isShowAppointment: false,

        }, () => {
            this.getAppointments();
        });

    }

    componentDidMount() {


        this.getAppointments();
    }


    render() {
        const { currentFilter } = this.state;

        console.log(this.state.appointments)
        const header = (
            <div className="table-header ma-tbl-header">
                <div className="ma-tbl-left">
                    {/* <h2 >All appointments</h2> */}

                    <Button className={`ma-ml10 cont-btn ${currentFilter != 1 ? 'p-button-outlined' : ''}`} label={'Booked'} onClick={() => this.onChangeStatusType(1)} />
                    <Button className={`ma-ml10 cont-btn ${currentFilter != 2 ? 'p-button-outlined' : ''}`} label={'Visisted'} onClick={() => this.onChangeStatusType(2)} />
                    <Button className={`ma-ml10 cont-btn ${currentFilter != 3 ? 'p-button-outlined' : ''}`} label={'Cancelled'} onClick={() => this.onChangeStatusType(3)} />

                    {this.state.showSearch && <InputText placeholder="Search" className="ma-tbl-search p-inputtext-md"
                        onChange={this.onGlobalSearch}
                        value={this.state.globalSearch}
                    />}
                </div>
                <div className="p-input-icon-left ma-tbl-filter">
                    <ul className="ma-tbl-li">
                        <li><i data-pr-tooltip="Search" data-pr-position="bottom" className="pi pi-search ma-tbl-icon ma-tbl-srch" onClick={(e) => { this.setState({ showSearch: !this.state.showSearch }) }}></i></li>
                        <Tooltip className="table-li-tooltip" autoHide={false} target=".ma-tbl-srch" />
                        <li><i data-pr-tooltip="Download" data-pr-position="bottom" className="pi pi-download ma-tbl-icon ma-tbl-dwnld" onClick={this.exportCSV}></i></li>
                        <Tooltip className="table-li-tooltip" target=".ma-tbl-dwnld" />
                    </ul>
                </div>
            </div>
        );


        return (<div>
            <Button label="+ Book an appointment" className='ma-m-lr10'
                onClick={this.showBookAnAppointment} />
            {
                this.state.isShowBookAppointment && <BookAnAppointment user={this.props.user} onHide={() => {

                    this.setState({
                        isShowBookAppointment: false
                    })
                }} />
            }
            <div className="card datatable-crud-demo ma-m30 fetch-q-tabled">
                {/* <LazyTable ></LazyTable> */}
                <DataTable ref={(el) => this.dt = el}
                    //  lazy
                    scrollable
                    responsiveLayout="scroll"
                    //  autoLayout={true}
                    rowHover
                    value={this.state.appointments}
                    // selection={this.state.selectedProducts}
                    // onSelectionChange={(e) => this.setState({ selectedProducts: e.value })}
                    dataKey="id"
                    //</div>={true}
                    lazy
                    onSort={this.onSort}
                    onPage={this.onPage}
                    onFilter={this.onFilter}
                    first={this.state.lazyParams.first}
                    last={this.state.totalRecords}
                    rows={this.state.lazyParams.rows}
                    totalRecords={this.state.totalRecords}
                    paginator
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    globalFilter={this.state.globalFilter}
                    header={header}

                >
                    <Column field="bookingDate" header="Date" body={(rowData) => {
                        return <>{moment(new Date(rowData.bookingDate)).format('LL')
                        }
                        </>
                    }} />
                    <Column field="bookingSlot" header="Slot Time" body={(rowData) => {
                        return <>{getTimeSlotByKey(rowData.bookingSlot)
                        }
                        </>
                    }} />
                    <Column headerClassName='difficulty' sortField='description' field="description" header="Description" />
                    <Column headerClassName='difficulty' sortField='doctor.name' field="doctor.name" header="Doctor Name" />
                    <Column headerClassName='difficulty' sortField='doctor.name' field="doctor.specialization" header="Doctor Specialization"
                        body={(rowData) => {
                            return <>
                                {
                                    Specialization.find((a) => a.key == rowData.doctor.specialization).value
                                }
                            </>
                        }}
                    />
                    <Column headerClassName='difficulty' sortField='status' field="status" header="Status"
                        body={(rowData) => {
                            return <>
                                {
                                    rowData.statusMessage

                                }
                            </>
                        }}
                    />
                    <Column
                        // headerClassName='option-2'
                        //headerStyle={{ width: "520px",  }}
                        //headerStyle={{ display: 'inline-block   ' }}
                        sortabl body={this.actionsTemplate} header="Actions" ></Column>
                </DataTable>

            </div>


            {
                this.state.isShowAppointment && <>
                    <AppointmentInfo onHide={() => {
                        this.setState({
                            isShowAppointment: false
                        })
                    }}
                        appointment={this.state.appointment}
                        onRatingUpdate={this.onRatingUpdate}
                    />
                </>
            }

        </div>
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

})(Authentication(withRouter(PatientAppointments)));
