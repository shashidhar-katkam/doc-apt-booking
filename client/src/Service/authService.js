import axios from 'axios';
import { API_URL } from './config';



export default class Service {
    login(loginData, isDoctor) {
        let url = `${API_URL}/${isDoctor ? 'doctor' : 'patient'}/login`
        return axios.post(url, loginData)
            .then(res => {
                if (res) {
                    return {
                        status: true,
                        res: res.data,
                    };
                }
            }).catch((err) => {
                if (err) {
                    if (err.response && err.response.status == 401) {
                        localStorage.clear();
                        window.location.reload();
                    } else if (err.response && err.response.data) {
                        if (err.response.data.errorResponse) {
                            return {
                                status: false,
                                errMessage: err?.response?.data?.messsge || ''
                            };

                        } else {
                            return err.response.data
                        }

                    } else {
                        return {
                            status: false,
                            errMessage: err.message
                        };
                    }

                }
            });
    }


    register(registerData, isDoctor) {
        let url = `${API_URL}/${isDoctor ? 'doctor' : 'patient'}/login`
        return axios.post(url, registerData)
            .then(res => {
                if (res) {
                    return {
                        status: true,
                        res: res.data,
                    };
                }
            }).catch((err) => {
                if (err) {
                    if (err.response && err.response.status == 401) {
                        localStorage.clear();
                        window.location.reload();
                    } else if (err.response && err.response.data) {
                        if (err.response.data.errorResponse) {
                            return {
                                status: false,
                                errMessage: err?.response?.data?.messsge || ''
                            };

                        } else {
                            return err.response.data
                        }

                    } else {
                        return {
                            status: false,
                            errMessage: err.message
                        };
                    }

                }
            });
    }

}