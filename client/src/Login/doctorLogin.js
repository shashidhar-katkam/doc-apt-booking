import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { getFormFields, isFormValid, onNumberChange, onTextChange } from 'src/Utils/formHelper';
import { Button } from 'primereact/button';
import { trimObj } from 'src/Utils';
import loginFormFields from './loginForm.json';
import DoctorRegistration from './doctorRegistration';
import Service from 'src/Service';
import { saveUserSession } from './../store/actions'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Authentication from './../session/index'
import LoadingComponent from 'src/LoadingComponent';





class DoctorLogin extends React.Component {

    constructor(props) {
        super(props);
        this.formFields = getFormFields(loginFormFields, { phoneNumber: '8801887034', password: 'Shashi@123' });
        this.state = {
            user: this.formFields.data,
            formValidations: this.formFields.formValidations,
            isNewUser: false,
        }

        this.service = new Service();
    }



    onLogin = () => {


        const formStatus = isFormValid(loginFormFields, this.formFields.formValidations, trimObj(this.state.user));


        let isCompleteFormValid = true;
        if (!formStatus.formValidations.isFormValid) {
            this.setState({
                formValidations: formStatus.formValidations,
            });
            isCompleteFormValid = false;
        }


        if (isCompleteFormValid) {
            let data = this.state.user;

            this.setState({
                isLoading: true
            });
            const url = `/doctor/login`;

            this.service.post(url, data, true).then((res) => {
                debugger

                if (res && res.status && res.res.status) {

                    this.setState({
                        isLoading: false
                    }, () => {
                        this.props.saveUserSession(res.res);
                        this.props.history.push('/')
                    })

                } else {

                    this.setState({
                        isLoading: false
                    });
                    this.toast.show({ severity: 'error', summary: 'Some error occured', detail: res.res.message, life: 3000 });
                }

            }).catch(e => {
                console.log(e);
                this.setState({
                    isLoading: false
                });
                this.toast.show({ severity: 'error', summary: 'Some error occured', detail: e.message, life: 3000 });
            })

        }




    }

    render() {
        const { user, formValidations, isNewUser } = this.state;
        return (<>
            <div className='doctor-login-form'>
                {
                    !isNewUser ? <div>


                        <div>
                            <p className='ma-label-s1 ma-no-pm'>Phone Number<span className='ma-required'>*</span></p>
                            <InputText className='ma-w100p p-inputtext-style1' autoComplete="off" value={user.phoneNumber} onChange={(e) => { onNumberChange(e.target.value, 'phoneNumber', this, loginFormFields, user, formValidations, 'user', 'formValidations') }} />
                            {formValidations && !formValidations.fields['phoneNumber'].isValid && <p className="p-error">{formValidations.fields['phoneNumber'].errorMsg}</p>}
                        </div>
                        <div className='ma-mt20'>
                            < p className='ma-label-s1  ma-no-pm'>Password<span className='ma-required'>*</span></p>
                            <InputText value={user.password}
                                type="password"
                                autoComplete="new-password"
                                className='ma-w100p p-inputtext-style1'
                                onChange={(e) => { onTextChange(e.target.value, 'password', this, loginFormFields, user, formValidations, 'user', 'formValidations') }} />
                            {formValidations && !formValidations.fields['password'].isValid && <p className="p-error">{formValidations.fields['password'].errorMsg}</p>}

                        </div>

                        <Toolbar className="ma-toolbar ma-mt20"
                            right={() => {
                                return (<Button label='Login' className='ma-m-lr10'
                                    onClick={this.onLogin}
                                />)
                            }}

                            left={() => {
                                return (<>
                                    <p>Are you a new user? <span className='register-txt' onClick={() => {
                                        this.setState({
                                            isNewUser: true
                                        })
                                    }} >Register</span></p>
                                </>)
                            }}

                        ></Toolbar>
                    </div> : <div>
                        <DoctorRegistration onLoginClick={() => {
                            this.setState({
                                isNewUser: false
                            })
                        }} />
                    </div>
                }

                <Toast ref={(el) => this.toast = el} position="bottom-right" />
            </div>

            {
                this.state.isLoading && <>
                    <LoadingComponent />
                </>
            }

        </>)
    }
}




const mapStateToProps = (state) => ({
    user: state.user,
    userType: state?.user?.userType,
    authenticated: state?.user?.authenticated,
});


export default connect(mapStateToProps, {
    saveUserSession,
})(Authentication(withRouter(DoctorLogin)));
