import axios from 'axios';
import { API_URL } from './config';

export default class Service {
    get(url, isAuthRequired) {
        let config;
        if (isAuthRequired) {
            config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('Bearer') ? localStorage.getItem('Bearer') : ''}`
                }
            };
        } else {
            config = {};
        }

        return axios.get(API_URL + url, config)
            .then(res => {
                if (res) {
                    return {
                        status: true,
                        res: res.data,
                        etag: res.headers.etag
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
                                errMessage: err.response.data.errorResponse[0] ? err.response.data.errorResponse[0].message : ''
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
    post(url, data, isAuthRequired) {
        let config;
        if (isAuthRequired) {
            config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('Bearer') ? localStorage.getItem('Bearer') : ''}`,
                }
            };
        } else {
            config = {};
        }
        return axios.post(API_URL + url, data, config)
            .then(res => {

                if (res) {
                    return {
                        status: true,
                        res: res.data
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
                                errMessage: err.response.data.errorResponse[0] ? err.response.data.errorResponse[0].message : ''
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
    put(url, data, isAuthRequired) {
        let config = {};
        if (isAuthRequired) {
            config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('Bearer') ? localStorage.getItem('Bearer') : ''}`,
                }
            };
        } else {
            config = {};
        }


        return axios.put(API_URL + url, data, config)
            .then(res => {
                if (res) {
                    return {
                        status: true,
                        res: res.data
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
                                errMessage: err.response.data.errorResponse[0] ? err.response.data.errorResponse[0].message : ''
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
    delete(url, isAuthRequired) {
        let config;
        if (isAuthRequired) {
            config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('Bearer') ? localStorage.getItem('Bearer') : ''}`
                }
            };
        } else {
            config = {};
        }
        return axios.delete(API_URL + url, config)
            .then(res => {
                if (res) {
                    return {
                        status: true,
                        res: res.data
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
                                errMessage: err.response.data.errorResponse[0] ? err.response.data.errorResponse[0].message : ''
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