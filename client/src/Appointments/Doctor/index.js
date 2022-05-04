import React, { Component } from 'react'
import { Button } from 'primereact/button';
import Service from 'src/Service';

import { TabView, TabPanel } from 'primereact/tabview';
import { BasicLazyParams } from 'src/Utils/constants';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';
import { Calendar } from 'primereact/calendar';
import moment from 'moment';
import { getTimeSlotByKey } from 'src/Utils';
import { Specialization } from 'src/Utils/constants';
import AppointmentInfo from './AppointmentInfo';



export default class DoctorAppointments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowBookAppointment: false,
            appointments: [],
            lazyParams: { ...BasicLazyParams, sortField: 'bookingSlot', sortOrder: 1 },
            globalSearch: '',
            isShowAppointment: false,
            appointment: null,
            currentTab: 0,
            bookingDate: moment(new Date()).format('l'),

        }
        this.service = new Service();


    }


    showBookAnAppointment = () => {
        this.setState({ isShowBookAppointment: true });
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
        const url = `/appointment/doctor?limit=${lazyParams.rows}&page=${lazyParams.page + 1}&search=${globalSearch}${lazyParams.sortField ? `&sort=${lazyParams.sortOrder == 1 ? '' : '-'}${lazyParams.sortField}` : ''}`;
        this.service.post(url, {
            bookingDate: moment(new Date(this.state.bookingDate)).format('l'),
            status: this.state.currentTab + 1

        }, true).then((res) => {

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

    onSlotDateChange = (e) => {

        this.setState({
            bookingDate: e.value
        }, () => {
            this.getAppointments()
        })

    }


    onStatusChange = () => {

        this.setState({
            isShowAppointment: false,

        }, this.getAppointments);

    }

    componentDidMount() {


        // this.getAppointments();
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

    renderDataTable = () => {
        const header = (
            <div className="table-header ma-tbl-header">
                <div className="ma-tbl-left">
                    <h2 >Appointments</h2>
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

        return <>
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
                    <Column headerClassName='difficulty' sortField='patient.name' field="patient.name" header="Patient Name" />
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

            </div></>
    }


    render() {
        console.log(this.state.appointments)


        return (<div>

            <p className='ma-label-s1  ma-no-pm'>Please select date</p>
            <Calendar value={this.state.bookingDate ? new Date(this.state.bookingDate) : new Date()}
                showIcon={true}
                placeholder='Slot Date'
                id='fromDatwes'
                onChange={this.onSlotDateChange}
                className='ma-w200'
            ></Calendar>


            <div className="paper-s1 ma-mt20">
                <TabView activeIndex={this.state.currentTab} onTabChange={(e) => this.setState({ currentTab: e.index }, this.getAppointments)}>
                    <TabPanel onChange header="Booked">
                        {this.renderDataTable()}
                    </TabPanel>
                    <TabPanel header="Visited">
                        {this.renderDataTable()}
                    </TabPanel>
                    <TabPanel header="Cancelled">
                        {this.renderDataTable()}
                    </TabPanel>
                </TabView>
            </div>





            {
                this.state.isShowAppointment && <>
                    <AppointmentInfo onHide={() => {
                        this.setState({
                            isShowAppointment: false
                        })
                    }}
                        appointment={this.state.appointment}
                        onStatusChange={this.onStatusChange}
                    />
                </>
            }


        </div>
        )
    }
}
