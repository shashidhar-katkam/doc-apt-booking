import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { getFormFields, isFormValid, onEmailChange, onNumberChange, onTextChange } from 'src/Utils/formHelper';
import { Button } from 'primereact/button';
import { trimObj } from 'src/Utils';
import doctorRegisterFormFields from './doctorRegisterForm.json';
import Service from 'src/Service';
import { saveUserSession } from './../store/actions'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Authentication from './../session/index'
import LoadingComponent from 'src/LoadingComponent';
import { Specialization } from 'src/Utils/constants';
import { InputTextarea } from 'primereact/inputtextarea';




class DoctorRegistration extends React.Component {

    constructor(props) {
        super(props);
        this.formFields = getFormFields(doctorRegisterFormFields, {});
        this.state = {
            user: this.formFields.data,
            formValidations: this.formFields.formValidations,
            isNewUser: false
        }

        this.service = new Service();

    }



    isAdditionalValid = () => {

        let user = JSON.parse(JSON.stringify(this.state.user));
        let { formValidations } = this.state;
        // password and confirm password 
        let isValid = true;
        if (user.password != user.passwordConfirm) {
            isValid = false;
            formValidations.fields['passwordConfirm'] = { ...formValidations.fields['passwordConfirm'], isValid: false, errorMsg: `Password and Confirm password is not matched.` }
        }

        this.setState((prevState) => {
            return {
                formValidations
            };
        });

        return isValid

    }


    onRegisterSuccess = (user) => {



    }


    onRegister = () => {


        const formStatus = isFormValid(doctorRegisterFormFields, this.formFields.formValidations, trimObj(this.state.user));


        let isCompleteFormValid = true;
        if (!formStatus.formValidations.isFormValid) {
            this.setState({
                formValidations: formStatus.formValidations,
            });
            isCompleteFormValid = false;
        }


        if (!this.isAdditionalValid()) {
            isCompleteFormValid = false;
        }


        if (isCompleteFormValid) {
            let data = trimObj(this.state.user);


            this.setState({
                isLoading: true
            });
            const url = `/doctor/sign-up`;

            this.service.post(url, data, true).then((res) => {


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
    }

    componentDidUpdate(prevProps) {
        if (prevProps.authenticated != this.props.authenticated && this.props.authenticated) {
            this.props.history.push('/')
        }
    }


    render() {
        console.log(this.props)
        const { user, formValidations, isNewUser } = this.state;
        return (<>
            <div className='doctor-login-form'>
                <div>
                    <div>
                        <p className='ma-label-s1  ma-no-pm'>Phone Number<span className='ma-required'>*</span></p>
                        <InputText className='ma-w100p  p-inputtext-style1' autoComplete="off" value={user.phoneNumber} onChange={(e) => { onNumberChange(e.target.value, 'phoneNumber', this, doctorRegisterFormFields, user, formValidations, 'user', 'formValidations') }} />
                        {formValidations && !formValidations.fields['phoneNumber'].isValid && <p className="p-error">{formValidations.fields['phoneNumber'].errorMsg}</p>}
                        <p className='ma-label-s1 ma-mt10 ma-no-pm'>Password<span className='ma-required'>*</span></p>
                        <InputText value={user.password}
                            type="password"
                            autoComplete="new-password"
                            className='ma-w100p p-inputtext-style1'
                            onChange={(e) => { onTextChange(e.target.value, 'password', this, doctorRegisterFormFields, user, formValidations, 'user', 'formValidations') }} />
                        {formValidations && !formValidations.fields['password'].isValid && <p className="p-error">{formValidations.fields['password'].errorMsg}</p>}
                        <p className='ma-label-s1 ma-mt10 ma-no-pm'>Confirm Password<span className='ma-required'>*</span></p>
                        <InputText value={user.passwordConfirm}
                            type="password"
                            autoComplete="new-password"
                            className='ma-w100p p-inputtext-style1'
                            onChange={(e) => { onTextChange(e.target.value, 'passwordConfirm', this, doctorRegisterFormFields, user, formValidations, 'user', 'formValidations') }} />
                        {formValidations && !formValidations.fields['passwordConfirm'].isValid && <p className="p-error">{formValidations.fields['passwordConfirm'].errorMsg}</p>}

                        <p className='ma-label-s1 ma-mt10 ma-no-pm'>Name of Doctor<span className='ma-required'>*</span></p>
                        <InputText value={user.name}
                            autoComplete="new-password"
                            className='ma-w100p p-inputtext-style1'
                            onChange={(e) => { onTextChange(e.target.value, 'name', this, doctorRegisterFormFields, user, formValidations, 'user', 'formValidations') }} />
                        {formValidations && !formValidations.fields['name'].isValid && <p className="p-error">{formValidations.fields['name'].errorMsg}</p>}

                        <p className='ma-label-s1 ma-mt10 ma-no-pm'>Gender<span className='ma-required'>*</span></p>
                        <Dropdown value={user.gender}
                            className='ma-w100p'
                            options={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]}
                            onChange={(e) => { onTextChange(e.value, 'gender', this, doctorRegisterFormFields, user, formValidations, 'user', 'formValidations') }}
                            placeholder="--Select--" />

                        {formValidations && !formValidations.fields['gender'].isValid && <p className="p-error">{formValidations.fields['gender'].errorMsg}</p>}


                        <p className='ma-label-s1 ma-mt10 ma-no-pm'>Email<span className='ma-required'>*</span></p>
                        <InputText value={user.email}
                            className='ma-w100p p-inputtext-style1'
                            onChange={(e) => { onEmailChange(e.target.value, 'email', this, doctorRegisterFormFields, user, formValidations, 'user', 'formValidations') }} />
                        {formValidations && !formValidations.fields['email'].isValid && <p className="p-error">{formValidations.fields['email'].errorMsg}</p>}

                        <p className='ma-label-s1 ma-mt10 ma-no-pm'>Address<span className='ma-required'>*</span></p>
                        <InputTextarea value={user.address}
                            rows={3}
                            className='ma-w100p p-inputtext-style1'
                            onChange={(e) => { onTextChange(e.target.value, 'address', this, doctorRegisterFormFields, user, formValidations, 'user', 'formValidations') }} />
                        {formValidations && !formValidations.fields['address'].isValid && <p className="p-error">{formValidations.fields['address'].errorMsg}</p>}

                        <p className='ma-label-s1 ma-mt10 ma-no-pm'>Specialization<span className='ma-required'>*</span></p>
                        <Dropdown value={user.specialization}
                            className='ma-w100p'
                            options={Specialization}
                            optionLabel="value"
                            optionValue='key'
                            onChange={(e) => { onTextChange(e.value, 'specialization', this, doctorRegisterFormFields, user, formValidations, 'user', 'formValidations') }}
                            placeholder="--Select--" />

                        {formValidations && !formValidations.fields['specialization'].isValid && <p className="p-error">{formValidations.fields['specialization'].errorMsg}</p>}
                        <p className='ma-label-s1 ma-mt10 ma-no-pm'>Qualification<span className='ma-required'>*</span></p>
                        <InputText value={user.qualification}
                            className='ma-w100p p-inputtext-style1'

                            onChange={(e) => { onTextChange(e.target.value, 'qualification', this, doctorRegisterFormFields, user, formValidations, 'user', 'formValidations') }} />
                        {formValidations && !formValidations.fields['qualification'].isValid && <p className="p-error">{formValidations.fields['qualification'].errorMsg}</p>}


                    </div>

                    <Toolbar className="ma-toolbar ma-mt20"
                        right={() => {
                            return (<Button label='Register' className=''
                                onClick={this.onRegister}
                            />)
                        }}

                        left={() => {
                            return (<>
                                <p>Are you registed? <span className='register-txt' onClick={this.props.onLoginClick} >Login</span></p>
                            </>)
                        }}

                    ></Toolbar>
                </div>

            </div>
            <Toast ref={(el) => this.toast = el} position="bottom-right" />

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
})(Authentication(withRouter(DoctorRegistration)));
