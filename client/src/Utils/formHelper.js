import _, { isNumber } from 'lodash';

class Util {

    phonenumber(inputText) {
        let phoneno = /^\d{10}$/;
        if (inputText.match(phoneno)) {
            return true;
        } else {
            return false;
        }
    }



    validateMobileNo(mobileNo) {
        let filter = /^(([0-9]{10})|(0[0-9]{10}))$/;
        if (filter.test(mobileNo)) {
            return true;
        } else {
            return false;
        }
    }

    validateWebSiteUrl(Url) {
        let filter = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/;
        if (filter.test(Url)) {
            return true;
        } else {
            return false;
        }
    }


}

export const isValidEmail = (email) => {
    let filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(email)) {
        return true;
    } else {
        return false;
    }
}


export const isValidMobile = (mobileNo) => {
    let filter = /^(([0-9]{10})|(0[0-9]{10}))$/;
    if (filter.test(mobileNo)) {
        return true;
    } else {
        return false;
    }
}


export const isDigit = (val) => {
    return /[^0-9]/.test(val);
}

export const isValidUrl = (Url) => {
    //return /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/.test(Url);
    return /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(Url)

}
export const FieldType = {
    Text: "Text",
    Password: "Password",
    Multi: "Multi",
    Email: "Email",
    Number: "Number",
    Choice: "Choice",
    Select: "Select",
    MultiSelect: "MultiSelect",
    CheckBox: "CheckBox",
    Toggle: "Toggle",
    DatePicker: "DatePicker",
    ReactQuill: "ReactQuill",
    DateTime: "DateTime",
    FileUpload: "FileUpload",
    FileUploadWithExport: "FileUploadWithExport",
    Urls: "Urls",
    Object: 'Object',
    Array: 'Array',
    Url: 'Url'
}




export const getFormFields = (formFields, formData) => {

    let data = _.cloneDeep(formData) || {};
    let fields = {};
    formFields.map((field) => {
        if (field.Type === FieldType.Text && data[field.FieldName] == undefined) {
            data[field.FieldName] = '';
        } else if (field.Type === FieldType.Multi && data[field.FieldName] == undefined) {
            data[field.FieldName] = '';
        } else if (field.Type === FieldType.Url && data[field.FieldName] == undefined) {
            data[field.FieldName] = '';
        } else if (field.Type === FieldType.Email && data[field.FieldName] == undefined) {
            data[field.FieldName] = '';
        } else if (field.Type === FieldType.Number && data[field.FieldName] == undefined) {
            data[field.FieldName] = '';
        } else if (field.Type === FieldType.Choice && data[field.FieldName] == undefined) {
            data[field.FieldName] = null;
        } else if (field.Type === FieldType.Select && data[field.FieldName] == undefined) {
            data[field.FieldName] = null;
        } else if (field.Type === FieldType.MultiSelect && data[field.FieldName] == undefined) {
            data[field.FieldName] = [];
        } else if (field.Type === FieldType.CheckBox && data[field.FieldName] == undefined) {
            data[field.FieldName] = false;
        } else if (field.Type === FieldType.Toggle && data[field.FieldName] == undefined) {
            data[field.FieldName] = false;
        } else if ((field.Type === FieldType.FileUploadWithExport || field.Type === FieldType.FileUpload || field.Type === FieldType.Urls) && data[field.FieldName] == undefined || field.Type === FieldType.Array) {
            if (data[field.FieldName] == null) {

                data[field.FieldName] = field.data ? field.data : [];
            }

        } else if (field.Type === FieldType.Object && (data[field.FieldName] == undefined)) {
            data[field.FieldName] = {};
        } else if (data[field.FieldName] == undefined) {
            data[field.FieldName] = null;
        }


        fields[field.FieldName] = {
            isValid: false,
            errorMsg: '',
            isRequired: field.Required,
            type: field.Type,
            minLength: field.MinLength,
            maxLength: field.MaxLength,
            id: field.UniqueId,
            reset: false
        };
    });


    return {
        data,
        formValidations: {
            isFormValid: true,
            fields
        }
    }

}

export const isFieldValid = (field, formValidations, data) => {

    let isFormValid = true;

    if (formValidations.fields[field.FieldName].type == FieldType.Text || formValidations.fields[field.FieldName].type == FieldType.Multi || formValidations.fields[field.FieldName].type == FieldType.DatePicker || formValidations.fields[field.FieldName].type == FieldType.Url) {
        if (field.Required) {
            if (data[field.FieldName] == '' || data[field.FieldName] == null) {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: false,
                    errorMsg: `${field.Label} is required.`
                }
                isFormValid = false;
                formValidations.isFormValid = false;
            } else if (data[field.FieldName].length < formValidations.fields[field.FieldName].minLength) {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: false,
                    errorMsg: `${formValidations.fields[field.FieldName].minLength} characters required`
                }
                if (formValidations.fields[field.FieldName].isRequired) {
                    isFormValid = false;
                }
            } else if (data[field.FieldName].length > formValidations.fields[field.FieldName].maxLength) {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: false,
                    errorMsg: `${formValidations.fields[field.FieldName].maxLength} characters required`
                }
                if (formValidations.fields[field.FieldName].isRequired) {
                    isFormValid = false;
                }
            } else {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: true,
                    errorMsg: ``
                }
            }
        }
    } else if (formValidations.fields[field.FieldName].type == FieldType.Email) {
        if ((data[field.FieldName] == '' || data[field.FieldName] == null) && formValidations.fields[field.FieldName].isRequired) {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: false,
                errorMsg: `${field.Label} is required.`
            }
            formValidations.isFormValid = false;
            isFormValid = false;
        } else if ((data[field.FieldName] != '' && data[field.FieldName] != null) && !isValidEmail(data[field.FieldName])) {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: false,
                errorMsg: `${field.Label} is invalid.`
            }
            formValidations.isFormValid = false;
            isFormValid = false;
        } else {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: true,
                errorMsg: ``
            }
        }
    } else if (formValidations.fields[field.FieldName].type == FieldType.Number) {
        if (data[field.FieldName] === "" || data[field.FieldName] == null) {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: formValidations.fields[field.FieldName].isRequired ? false : true,
                errorMsg: `${formValidations.fields[field.FieldName].isRequired ? `${field.Label} is required.` : ''}`
            }
            if (formValidations.fields[field.FieldName].isRequired) {
                isFormValid = false;
            }
        } else if (isDigit(data[field.FieldName].trim())) {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: formValidations.fields[field.FieldName].isRequired ? false : true,
                errorMsg: `${formValidations.fields[field.FieldName].isRequired ? `Only numbers are allowed` : ''}`
            }
            if (formValidations.fields[field.FieldName].isRequired) {
                isFormValid = false;
            }
        } else if (data[field.FieldName].length < formValidations.fields[field.FieldName].minLength) {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: false,
                errorMsg: field.errMsgCustom ? field.errMsg : `${formValidations.fields[field.FieldName].minLength} characters required`
            }
            if (formValidations.fields[field.FieldName].isRequired) {
                isFormValid = false;
            }
        } else if (data[field.FieldName].length > formValidations.fields[field.FieldName].maxLength) {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: false,
                errorMsg: field.errMsgCustom ? field.errMsg : `${formValidations.fields[field.FieldName].maxLength} characters required`
            }
            if (formValidations.fields[field.FieldName].isRequired) {
                isFormValid = false;
            }
        } else {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: false,
                errorMsg: ``
            }
        }
    } else if (formValidations.fields[field.FieldName].type == FieldType.Choice || formValidations.fields[field.FieldName].type == FieldType.Select) {
        if (data[field.FieldName] === "" || data[field.FieldName] == null) {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: formValidations.fields[field.FieldName].isRequired ? false : true,
                errorMsg: `${formValidations.fields[field.FieldName].isRequired ? `${field.Label} is required.` : ''}`
            }
            if (formValidations.fields[field.FieldName].isRequired) {
                isFormValid = false;
            }
        }
    } else if (formValidations.fields[field.FieldName].type == FieldType.Toggle) {
        //if (data[field.FieldName] === "" || data[field.FieldName] == null) {
        formValidations.fields[field.FieldName] = {
            ...formValidations.fields[field.FieldName],
            isValid: formValidations.fields[field.FieldName].isRequired ? false : true,
            errorMsg: `${formValidations.fields[field.FieldName].isRequired ? `${field.Label} is required.` : ''}`
        }
        if (formValidations.fields[field.FieldName].isRequired) {
            isFormValid = false;
        }
        // }
    } else if (formValidations.fields[field.FieldName].type == FieldType.MultiSelect) {
        if (data[field.FieldName] == null || (data[field.FieldName] && data[field.FieldName].length == 0)) {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: formValidations.fields[field.FieldName].isRequired ? false : true,
                errorMsg: `${formValidations.fields[field.FieldName].isRequired ? `${field.Label} is required.` : ''}`
            }
            if (formValidations.fields[field.FieldName].isRequired) {
                isFormValid = false;
            }
        }
    } else if (formValidations.fields[field.FieldName].type == FieldType.FileUpload || formValidations.fields[field.FieldName].type == FieldType.FileUploadWithExport) {
        if (data[field.FieldName] == null || (data[field.FieldName] && data[field.FieldName].length == 0)) {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: formValidations.fields[field.FieldName].isRequired ? false : true,
                errorMsg: `${formValidations.fields[field.FieldName].isRequired ? `Atleast one file is required.` : ''}`
            }
            if (formValidations.fields[field.FieldName].isRequired) {
                isFormValid = false;
            }
        } else if (data[field.FieldName] && data[field.FieldName].length > 0) {
            let filesInfo = data[field.FieldName];
            for (let i = 0; i < filesInfo.length; i++) {
                if (!filesInfo[i].response) {
                    formValidations.fields[field.FieldName] = {
                        ...formValidations.fields[field.FieldName],
                        isValid: false,
                        errorMsg: 'Please wait until files are uploaded.'
                    }
                    isFormValid = false;
                } else {
                    formValidations.fields[field.FieldName] = {
                        ...formValidations.fields[field.FieldName],
                        isValid: true,
                        errorMsg: ''
                    }
                }
            }
        }
    } else if (formValidations.fields[field.FieldName].type == FieldType.Urls) {
        if (data[field.FieldName] == null || (data[field.FieldName] && data[field.FieldName].length == 0)) {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: formValidations.fields[field.FieldName].isRequired ? false : true,
                errorMsg: `${formValidations.fields[field.FieldName].isRequired ? `Atleast one url info is required.` : ''}`
            }
            if (formValidations.fields[field.FieldName].isRequired) {
                isFormValid = false;
            }
        } else if (data[field.FieldName] && data[field.FieldName].length > 0) {
            let filesInfo = data[field.FieldName];
            let isValid = true;
            for (let i = 0; i < filesInfo.length; i++) {
                if (filesInfo[i].fileNewName === "") {
                    isFormValid = false;
                    isValid = false;
                    filesInfo[i].fileNewNameErr = "File name is required."
                }
                if (filesInfo[i].filePath === "") {
                    isFormValid = false;
                    isValid = false;
                    filesInfo[i].filePathErr = "Url is required."
                }
                if (filesInfo[i].mimeType === "") {
                    isFormValid = false;
                    isValid = false;
                    filesInfo[i].mimeTypeErr = "File type is required."
                }
            }
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: false,
                errorMsg: `${isValid ? '' : 'Please fill all the fields.'}`
            }
            data[field.FieldName] = filesInfo;
        }
    } else if (formValidations.fields[field.FieldName].type == FieldType.ReactQuill) {
        if ((data[field.FieldName] == '<p><br></p>' || data[field.FieldName] == null) && formValidations.fields[field.FieldName].isRequired) {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: false,
                errorMsg: `${field.Label} is required.`
            }
            formValidations.isFormValid = false;
            isFormValid = false;
        } else {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: true,
                errorMsg: ``
            }
        }
    } else if (formValidations.fields[field.FieldName].type == FieldType.Object) {
        if ((JSON.stringify(data[field.FieldName]) == JSON.stringify({}) || data[field.FieldName] == null) && formValidations.fields[field.FieldName].isRequired) {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: false,
                errorMsg: field.errMsgCustom ? field.errMsg : ` ${field.Label} is required.`
            }
            formValidations.isFormValid = false;
            isFormValid = false;
        } else {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: true,
                errorMsg: ``
            }
        }
    } else if (formValidations.fields[field.FieldName].type == FieldType.Array) {
        if ((data[field.FieldName].length == 0 || data[field.FieldName] == null) && formValidations.fields[field.FieldName].isRequired) {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: false,
                errorMsg: field.errMsgCustom ? field.errMsg : ` ${field.Label} is required.`
            }
            formValidations.isFormValid = false;
            isFormValid = false;
        } else {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: true,
                errorMsg: ``
            }
        }
    }

    formValidations.isFormValid = isFormValid;

    return formValidations;

}

export const isFormValid = (formFields, formValidations, data) => {
    let isFormValid = true;

    formFields.map((field) => {
        if (formValidations.fields[field.FieldName].type == FieldType.Text || formValidations.fields[field.FieldName].type == FieldType.Multi || formValidations.fields[field.FieldName].type == FieldType.DatePicker || formValidations.fields[field.FieldName].type == FieldType.Url) {
            if (field.Required) {
                if (data[field.FieldName] == '' || data[field.FieldName] == null) {
                    formValidations.fields[field.FieldName] = {
                        ...formValidations.fields[field.FieldName],
                        isValid: false,
                        errorMsg: `${field.Label} is required.`
                    }
                    isFormValid = false;
                    formValidations.isFormValid = false;
                } else if (data[field.FieldName].length < formValidations.fields[field.FieldName].minLength) {
                    formValidations.fields[field.FieldName] = {
                        ...formValidations.fields[field.FieldName],
                        isValid: false,
                        errorMsg: `Min ${formValidations.fields[field.FieldName].minLength} characters required`
                    }
                    if (formValidations.fields[field.FieldName].isRequired) {
                        isFormValid = false;
                    }
                } else if (data[field.FieldName].length > formValidations.fields[field.FieldName].maxLength) {
                    formValidations.fields[field.FieldName] = {
                        ...formValidations.fields[field.FieldName],
                        isValid: false,
                        errorMsg: `Max ${formValidations.fields[field.FieldName].maxLength} characters required`
                    }
                    if (formValidations.fields[field.FieldName].isRequired) {
                        isFormValid = false;
                    }
                } else {
                    formValidations.fields[field.FieldName] = {
                        ...formValidations.fields[field.FieldName],
                        isValid: true,
                        errorMsg: ``
                    }
                }
            }
        } else if (formValidations.fields[field.FieldName].type == FieldType.Password) {
            if (field.Required) {
                if (data[field.FieldName] == '' || data[field.FieldName] == null) {
                    formValidations.fields[field.FieldName] = {
                        ...formValidations.fields[field.FieldName],
                        isValid: false,
                        errorMsg: `${field.Label} is required.`
                    }
                    isFormValid = false;
                    formValidations.isFormValid = false;
                } else if (data[field.FieldName].length < formValidations.fields[field.FieldName].minLength) {
                    formValidations.fields[field.FieldName] = {
                        ...formValidations.fields[field.FieldName],
                        isValid: false,
                        errorMsg: `Min ${formValidations.fields[field.FieldName].minLength} characters required`
                    }
                    if (formValidations.fields[field.FieldName].isRequired) {
                        isFormValid = false;
                    }
                } else if (data[field.FieldName].length > formValidations.fields[field.FieldName].maxLength) {
                    formValidations.fields[field.FieldName] = {
                        ...formValidations.fields[field.FieldName],
                        isValid: false,
                        errorMsg: `Max ${formValidations.fields[field.FieldName].maxLength} characters required`
                    }
                    if (formValidations.fields[field.FieldName].isRequired) {
                        isFormValid = false;
                    }
                } else if (!(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$*.\[\]{}\(\)?\-"!@#%&\/\\,><':;|_~`]).{8,}/).test(data[field.FieldName])) {
                    formValidations.fields[field.FieldName] = {
                        ...formValidations.fields[field.FieldName],
                        isValid: false,
                        errorMsg: `Password must contain at least 1 lowercase, 1 uppercase, 1 numeric, 1 special character and must be eight characters or longer`
                    }
                    if (formValidations.fields[field.FieldName].isRequired) {
                        isFormValid = false;
                    }
                } else {
                    formValidations.fields[field.FieldName] = {
                        ...formValidations.fields[field.FieldName],
                        isValid: true,
                        errorMsg: ``
                    }
                }
            }
        } else if (formValidations.fields[field.FieldName].type == FieldType.Email) {
            if ((data[field.FieldName] == '' || data[field.FieldName] == null) && formValidations.fields[field.FieldName].isRequired) {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: false,
                    errorMsg: `${field.Label} is required.`
                }
                formValidations.isFormValid = false;
                isFormValid = false;
            } else if ((data[field.FieldName] != '' && data[field.FieldName] != null) && !isValidEmail(data[field.FieldName])) {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: false,
                    errorMsg: `${field.Label} is invalid.`
                }
                formValidations.isFormValid = false;
                isFormValid = false;
            } else {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: true,
                    errorMsg: ``
                }
            }
        } else if (formValidations.fields[field.FieldName].type == FieldType.Number) {
            if (data[field.FieldName] === "" || data[field.FieldName] == null) {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: formValidations.fields[field.FieldName].isRequired ? false : true,
                    errorMsg: `${formValidations.fields[field.FieldName].isRequired ? `${field.Label} is required.` : ''}`
                }
                if (formValidations.fields[field.FieldName].isRequired) {
                    isFormValid = false;
                }
            } else if (isDigit(data[field.FieldName].trim())) {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: formValidations.fields[field.FieldName].isRequired ? false : true,
                    errorMsg: `${formValidations.fields[field.FieldName].isRequired ? `Only numbers are allowed` : ''}`
                }
                if (formValidations.fields[field.FieldName].isRequired) {
                    isFormValid = false;
                }
            } else if (data[field.FieldName].length < formValidations.fields[field.FieldName].minLength) {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: false,
                    errorMsg: field.errMsgCustom ? field.errMsg : `Min ${formValidations.fields[field.FieldName].minLength} characters required`
                }
                if (formValidations.fields[field.FieldName].isRequired) {
                    isFormValid = false;
                }
            } else if (data[field.FieldName].length > formValidations.fields[field.FieldName].maxLength) {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: false,
                    errorMsg: field.errMsgCustom ? field.errMsg : `Max ${formValidations.fields[field.FieldName].maxLength} characters required`
                }
                if (formValidations.fields[field.FieldName].isRequired) {
                    isFormValid = false;
                }
            } else {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: false,
                    errorMsg: ``
                }
            }
        } else if (formValidations.fields[field.FieldName].type == FieldType.Choice || formValidations.fields[field.FieldName].type == FieldType.Select) {
            if (data[field.FieldName] === "" || data[field.FieldName] == null) {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: formValidations.fields[field.FieldName].isRequired ? false : true,
                    errorMsg: `${formValidations.fields[field.FieldName].isRequired ? `${field.Label} is required.` : ''}`
                }
                if (formValidations.fields[field.FieldName].isRequired) {
                    isFormValid = false;
                }
            }
        } else if (formValidations.fields[field.FieldName].type == FieldType.Toggle) {
            //if (data[field.FieldName] === "" || data[field.FieldName] == null) {
            formValidations.fields[field.FieldName] = {
                ...formValidations.fields[field.FieldName],
                isValid: formValidations.fields[field.FieldName].isRequired ? false : true,
                errorMsg: `${formValidations.fields[field.FieldName].isRequired ? `${field.Label} is required.` : ''}`
            }
            if (formValidations.fields[field.FieldName].isRequired) {
                isFormValid = false;
            }
            // }
        } else if (formValidations.fields[field.FieldName].type == FieldType.MultiSelect) {
            if (data[field.FieldName] == null || (data[field.FieldName] && data[field.FieldName].length == 0)) {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: formValidations.fields[field.FieldName].isRequired ? false : true,
                    errorMsg: `${formValidations.fields[field.FieldName].isRequired ? `${field.Label} is required.` : ''}`
                }
                if (formValidations.fields[field.FieldName].isRequired) {
                    isFormValid = false;
                }
            }
        } else if (formValidations.fields[field.FieldName].type == FieldType.FileUpload || formValidations.fields[field.FieldName].type == FieldType.FileUploadWithExport) {
            if (data[field.FieldName] == null || (data[field.FieldName] && data[field.FieldName].length == 0)) {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: formValidations.fields[field.FieldName].isRequired ? false : true,
                    errorMsg: `${formValidations.fields[field.FieldName].isRequired ? `Atleast one file is required.` : ''}`
                }
                if (formValidations.fields[field.FieldName].isRequired) {
                    isFormValid = false;
                }
            } else if (data[field.FieldName] && data[field.FieldName].length > 0) {
                let filesInfo = data[field.FieldName];
                for (let i = 0; i < filesInfo.length; i++) {
                    if (!filesInfo[i].response) {
                        formValidations.fields[field.FieldName] = {
                            ...formValidations.fields[field.FieldName],
                            isValid: false,
                            errorMsg: 'Please wait until files are uploaded.'
                        }
                        isFormValid = false;
                    } else {
                        formValidations.fields[field.FieldName] = {
                            ...formValidations.fields[field.FieldName],
                            isValid: true,
                            errorMsg: ''
                        }
                    }
                }
            }
        } else if (formValidations.fields[field.FieldName].type == FieldType.Urls) {
            if (data[field.FieldName] == null || (data[field.FieldName] && data[field.FieldName].length == 0)) {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: formValidations.fields[field.FieldName].isRequired ? false : true,
                    errorMsg: `${formValidations.fields[field.FieldName].isRequired ? `Atleast one url info is required.` : ''}`
                }
                if (formValidations.fields[field.FieldName].isRequired) {
                    isFormValid = false;
                }
            } else if (data[field.FieldName] && data[field.FieldName].length > 0) {
                let filesInfo = data[field.FieldName];
                let isValid = true;
                for (let i = 0; i < filesInfo.length; i++) {
                    if (filesInfo[i].fileNewName === "") {
                        isFormValid = false;
                        isValid = false;
                        filesInfo[i].fileNewNameErr = "File name is required."
                    }
                    if (filesInfo[i].filePath === "") {
                        isFormValid = false;
                        isValid = false;
                        filesInfo[i].filePathErr = "Url is required."
                    }
                    if (filesInfo[i].mimeType === "") {
                        isFormValid = false;
                        isValid = false;
                        filesInfo[i].mimeTypeErr = "File type is required."
                    }
                }
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: false,
                    errorMsg: `${isValid ? '' : 'Please fill all the fields.'}`
                }
                data[field.FieldName] = filesInfo;
            }
        } else if (formValidations.fields[field.FieldName].type == FieldType.ReactQuill) {
            if ((data[field.FieldName] == '<p><br></p>' || data[field.FieldName] == null) && formValidations.fields[field.FieldName].isRequired) {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: false,
                    errorMsg: `${field.Label} is required.`
                }
                formValidations.isFormValid = false;
                isFormValid = false;
            } else {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: true,
                    errorMsg: ``
                }
            }
        } else if (formValidations.fields[field.FieldName].type == FieldType.Object) {
            if ((JSON.stringify(data[field.FieldName]) == JSON.stringify({}) || data[field.FieldName] == null) && formValidations.fields[field.FieldName].isRequired) {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: false,
                    errorMsg: field.errMsgCustom ? field.errMsg : ` ${field.Label} is required.`
                }
                formValidations.isFormValid = false;
                isFormValid = false;
            } else {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: true,
                    errorMsg: ``
                }
            }
        } else if (formValidations.fields[field.FieldName].type == FieldType.Array) {
            if ((data[field.FieldName].length == 0 || data[field.FieldName] == null) && formValidations.fields[field.FieldName].isRequired) {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: false,
                    errorMsg: field.errMsgCustom ? field.errMsg : ` ${field.Label} is required.`
                }
                formValidations.isFormValid = false;
                isFormValid = false;
            } else {
                formValidations.fields[field.FieldName] = {
                    ...formValidations.fields[field.FieldName],
                    isValid: true,
                    errorMsg: ``
                }
            }
        }

    });

    formValidations.isFormValid = isFormValid;

    return {
        formValidations,
        data,
        isFormValid
    }
}



export const trimAll = (object) => {



}



export const onTextChange = (value, fieldName, thisObj, formFields, formData, formValidations, formName, formValidationName) => {

    let data = JSON.parse(JSON.stringify(formData));
    data[fieldName] = value;
    let fieldInfo = formFields.filter((f) => f.FieldName == fieldName);
    fieldInfo = fieldInfo[0];

    if (formValidations.fields[fieldName].isRequired) {
        if (data[fieldName] == '' || data[fieldName] == null) {
            formValidations.fields[fieldName] = {
                ...formValidations.fields[fieldName],
                isValid: false,
                errorMsg: `${fieldInfo.RequiredMsg ? fieldInfo.RequiredMsg : fieldInfo.Label + ' is required'}`
            }
            formValidations.isFormValid = false;
        } else if (data[fieldName].length < formValidations.fields[fieldName].minLength) {
            formValidations.fields[fieldName] = {
                ...formValidations.fields[fieldName],
                isValid: false,
                errorMsg: `${fieldInfo.MinimumMsg ? (fieldInfo.MinimumMsg + ' ' + formValidations.fields[fieldName].minLength) : formValidations.fields[fieldName].minLength + ' characters required'}`
            }
            if (formValidations.fields[fieldName].isRequired) { }
        } else if (data[fieldName].length > formValidations.fields[fieldName].maxLength) {
            formValidations.fields[fieldName] = {
                ...formValidations.fields[fieldName],
                isValid: false,
                errorMsg: `${fieldInfo.MaximumMsg ? (fieldInfo.MaximumMsg + ' ' + formValidations.fields[fieldName].maxLength) : formValidations.fields[fieldName].maxLength + ' characters required'}`
            }
            if (formValidations.fields[fieldName].isRequired) { }
        } else {
            formValidations.fields[fieldName] = {
                ...formValidations.fields[fieldName],
                isValid: true,
                errorMsg: ``
            }
        }
    }

    thisObj.setState({
        [formName]: data,
        [formValidationName]: formValidations,
    });
}

export const onNumberChange = (value, fieldName, thisObj, formFields, formData, formValidations, formName, formValidationsName) => {
    let data = JSON.parse(JSON.stringify(formData));
    let fieldInfo = formFields.filter((f) => f.FieldName == fieldName);
    fieldInfo = fieldInfo[0];

    if (value != "" && !isDigit(value)) {

        data[fieldName] = value;
        if (formValidations.fields[fieldName].isRequired) {
            if (data[fieldName] == '' || data[fieldName] == null) {
                formValidations.fields[fieldName] = {
                    ...formValidations.fields[fieldName],
                    isValid: false,
                    errorMsg: `${fieldInfo.RequiredMsg ? fieldInfo.RequiredMsg : fieldInfo.Label + ' is required'}`
                }
                formValidations.isFormValid = false;
            } else if (isDigit(data[fieldName].trim())) {
                formValidations.fields[fieldName] = {
                    ...formValidations.fields[fieldName],
                    isValid: false,
                    errorMsg: `Numbers are allowed`
                }
                formValidations.isFormValid = false;
            } else if (data[fieldName].length < formValidations.fields[fieldName].minLength) {
                formValidations.fields[fieldName] = {
                    ...formValidations.fields[fieldName],
                    isValid: false,
                    errorMsg: `${fieldInfo.MinimumMsg ? (fieldInfo.MinimumMsg + ' ' + formValidations.fields[fieldName].minLength) : 'Min' + formValidations.fields[fieldName].minLength + ' characters required'}`
                }
                if (formValidations.fields[fieldName].isRequired) { }
            } else if (data[fieldName].length > formValidations.fields[fieldName].maxLength) {
                formValidations.fields[fieldName] = {
                    ...formValidations.fields[fieldName],
                    isValid: false,
                    errorMsg: `${fieldInfo.MaximumMsg ? (fieldInfo.MaximumMsg + ' ' + formValidations.fields[fieldName].maxLength) : 'Max' + formValidations.fields[fieldName].maxLength + ' characters required'}`
                }
                if (formValidations.fields[fieldName].isRequired) { }
            } else {
                formValidations.fields[fieldName] = {
                    ...formValidations.fields[fieldName],
                    isValid: true,
                    errorMsg: ``
                }
            }
        }
    } else {
        formValidations.fields[fieldName] = {
            ...formValidations.fields[fieldName],
            isValid: false,
            errorMsg: `${fieldInfo.NaNMessage ? fieldInfo.NaNMessage + ' ' + fieldInfo.Label : 'Invalid ' + fieldInfo.Label}`
        }
        if (value == '') {
            data[fieldName] = value;
        }
    }
    thisObj.setState({
        [formName]: data,
        [formValidationsName]: formValidations
    });
}



export const onDropDownChange = (value, fieldName, thisObj, formFields, formData, formValidations, formName, formValidationsName) => {

    let data = JSON.parse(JSON.stringify(formData));
    data[fieldName] = value;
    let fieldInfo = formFields.filter((f) => f.FieldName == fieldName)
    fieldInfo = fieldInfo[0];
    if (formValidations.fields[fieldName].isRequired) {
        if (data[fieldName] == '' || data[fieldName] == null) {
            formValidations.fields[fieldName] = {
                ...formValidations.fields[fieldName],
                isValid: false,
                errorMsg: fieldInfo.RequiredMsg ? fieldInfo.RequiredMsg : `${fieldInfo.Label} is required.`
            }
            formValidations.isFormValid = false;
        } else {
            formValidations.fields[fieldName] = {
                ...formValidations.fields[fieldName],
                isValid: true,
                errorMsg: ``
            }
        }
    }

    thisObj.setState({
        [formName]: data,
        [formValidationsName]: formValidations
    });
};



export const onChoiceChange = (value, fieldName, thisObj, formFields, formData, formValidations, formName, formValidationsName) => {
    let data = JSON.parse(JSON.stringify(formData));
    data[fieldName] = value;
    let fieldInfo = formFields.filter((f) => f.FieldName == fieldName)
    fieldInfo = fieldInfo[0];
    if (formValidations.fields[fieldName].isRequired) {
        if (data[fieldName] == '' || data[fieldName] == null) {
            formValidations.fields[fieldName] = {
                ...formValidations.fields[fieldName],
                isValid: false,
                errorMsg: fieldInfo.RequiredMsg ? fieldInfo.RequiredMsg : `${fieldInfo.Label} is required.`
            }
            formValidations.isFormValid = false;
        } else {
            formValidations.fields[fieldName] = {
                ...formValidations.fields[fieldName],
                isValid: true,
                errorMsg: ``
            }
        }
    }

    thisObj.setState({
        [formName]: data,
        [formValidationsName]: formValidations
    });
}


export const onEmailChange = (value, fieldName, thisObj, formFields, formData, formValidations, formName, formValidationName) => {

    let data = JSON.parse(JSON.stringify(formData));
    data[fieldName] = value;
    let fieldInfo = formFields.filter((f) => f.FieldName == fieldName);
    fieldInfo = fieldInfo[0];

    if (formValidations.fields[fieldName].isRequired) {
        if (data[fieldName] == '' || data[fieldName] == null) {
            formValidations.fields[fieldName] = {
                ...formValidations.fields[fieldName],
                isValid: false,
                errorMsg: `${fieldInfo.RequiredMsg ? fieldInfo.RequiredMsg : fieldInfo.Label + ' is required'}`
            }
            formValidations.isFormValid = false;
        } else if ((data[fieldName] != '' && data[fieldName] != null) && !isValidEmail(data[fieldName])) {
            formValidations.fields[fieldName] = {
                ...formValidations.fields[fieldName],
                isValid: false,
                errorMsg: `${fieldInfo.Label} is invalid.`
            }
            formValidations.isFormValid = false;
        } else {
            formValidations.fields[fieldName] = {
                ...formValidations.fields[fieldName],
                isValid: true,
                errorMsg: ``
            }
        }
    }

    thisObj.setState({
        [formName]: data,
        [formValidationName]: formValidations
    });
}

export const onChipsChange = (value, fieldName, thisObj, formFields, formData, formValidations, formName, formValidationsName, additionalState = {}) => {

    let data = JSON.parse(JSON.stringify(formData));
    data[fieldName] = value;
    let fieldInfo = formFields.filter((f) => f.FieldName == fieldName)
    fieldInfo = fieldInfo[0];
    if (formValidations.fields[fieldName].isRequired) {
        if (!data[fieldName].length) {
            formValidations.fields[fieldName] = {
                ...formValidations.fields[fieldName],
                isValid: false,
                errorMsg: fieldInfo.RequiredMsg ? fieldInfo.RequiredMsg : `${fieldInfo.Label} is required.`
            }
            formValidations.isFormValid = false;
        } else {
            formValidations.fields[fieldName] = {
                ...formValidations.fields[fieldName],
                isValid: true,
                errorMsg: ``
            }
        }
    }

    thisObj.setState({
        [formName]: data,
        [formValidationsName]: formValidations,
        ...additionalState
    });
};