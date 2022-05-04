import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { API_URL } from 'src/Service/config';
import axios from 'axios';
import { saveUserSession, sessionsChecked } from './../store/actions'

export default function (ComposedComponent) {
    class Authentication extends Component {
        state = {
            open: false
        };

        handleClick = () => {
            this.setState({ open: true });
        };

        handleClose = () => {
            this.setState({ open: false });
        };



        initiateGetSession = () => {
            let userType = localStorage.getItem('userType');


            if (userType) {


                const url = `${API_URL}/${userType}/session`;

                let config = {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('Bearer') ? localStorage.getItem('Bearer') : ''}`
                    }
                };
                axios.get(url, config)
                    .then(res => {
                        if (res && res.data) {
                            this.setState({
                                isLoading: false
                            }, () => {
                                this.props.saveUserSession(res.data);
                            })

                        } else {
                            this.props.sessionsChecked();
                            this.setState({
                                isLoading: false
                            })
                        }
                    }).catch((err) => {
                        this.setState({
                            isLoading: false
                        })


                    });
            } else {
                this.props.sessionsChecked();
            }
        }
        componentDidMount() {
            if (!this.props.authenticated) {

                this.initiateGetSession();

                // retrieveUserFromLocalStorage(this.props.dispatch)
                //     .then((res) => {
                //         if (res) {
                //             this.props.authUser(res);
                //             this.props.getUserData();
                //         }
                //     })
                //     .catch((e) => {
                //         this.props.history.push('/login');
                //     });
            }
        }

        componentDidUpdate(prevProps) {
            if (prevProps.authenticated !== this.props.authenticated) {
                if (!this.props.authenticated) {
                    this.initiateGetSession();


                }
            }
        }

        render() {
            return (
                <>
                    <ComposedComponent {...this.props} />
                </>
            );
        }
    }

    function mapStateToProps(state) {

        return {
            user: state.user,
            userType: state?.user?.userType,
            authenticated: state?.user?.authenticated,
        };
    }



    return connect(mapStateToProps, { saveUserSession, sessionsChecked })(withRouter(Authentication));
}
