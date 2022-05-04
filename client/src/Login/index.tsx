import React from 'react';

import { TabView, TabPanel } from 'primereact/tabview';
import './styles.css'
import DoctorLogin from './doctorLogin';
import PatientLogin from './patientLogin';




export class Login extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            logindata: {

            },
            activeTab: 1,
        }

    }




    render(): React.ReactNode {
        return (<>
            <div className='login-form'>
                <h3 className='login-title ma-txt-center ma-pointer'>Doc. Apt. Mgt. Portal</h3>
                <label className='sp-label-2'>Are you a </label>
                <TabView activeIndex={this.state.activeTab} onTabChange={(e) => this.setState({ activeTab: e.index })}>
                    <TabPanel header="Patient">
                        <PatientLogin />


                    </TabPanel>
                    <TabPanel header="Doctor">
                        <DoctorLogin />

                    </TabPanel>
                </TabView>
            </div>
        </>)
    }
}

