import { ACTIONS } from './../actionTypes';


// const dispatchRequestUserData = data => ({
//     type: ActionTypes.REQUEST_USER_DATA,
//     data
// })

// const dispatchReceivedUserData = (data, userIdsInfo, packageDetails, subscribedChapters) => ({
//     type: ActionTypes.RECEIVED_USER_DATA,
//     data,
//     userIdsInfo,
//     packageDetails,
//     subscribedChapters
// })

// const dispatchErrorUserData = err => ({
//     type: ActionTypes.ERROR_USER_DATA,
//     err
// })

// const dispatchClearUserData = () => ({
//     type: ActionTypes.CLEAR_USER_DATA
// })

// const dispatchIsValidUserData = res => ({
//     type: ActionTypes.IS_VALID_USER_DATA,
//     res
// })


const dispatchUserData = data => ({
    type: ACTIONS.SAVE_USER_SESSION,
    data
})

const dispatchSessionsChecked = data => ({
    type: ACTIONS.SESSION_CHECKED,
    data
})





// export const clearUserData = () => dispatchClearUserData();

// export const getUserData = () => dispatch => {
//     dispatch(dispatchRequestUserData());
//     const userToken = localStorage.getItem('user_token');
//     const options = {
//         method: 'get',
//         url: `${baseUrlAdmin}/user/data`,
//         headers: {
//             'Authorization': `Bearer ${localStorage.getItem('Bearer') ? localStorage.getItem('Bearer') : ''}`
//         }
//     }
//     axios(options)
//         .then((res) => {
//             const userData = res && res.data && res.data.Item && res.data.Item || {};
//             let userIdsInfo = {}
//             let packageDetails = [];
//             let subscribedChapters = [];
//             if (userData && Object.keys(userData).length && userData.user_info) {
//                 userIdsInfo = {
//                     userId: userData.user_id,
//                     boardId: userData && userData.user_info && userData.user_info.boardId && userData.user_info.boardId,
//                     classId: userData && userData.user_info && userData.user_info.classId && userData.user_info.classId,
//                     groupId: userData && userData.user_info && userData.user_info.groupId && userData.user_info.groupId,

//                 }
//             }
//             if (userData && Object.keys(userData).length && userData.packageDetails && userData.packageDetails.length) {
//                 packageDetails = userData.packageDetails;
//                 packageDetails.map(pack => {
//                     if (pack.chapters && pack.chapters.length) {
//                         pack.chapters.map(chapter => {
//                             const chapterWithPackageId = { packageCode: pack.packageCode, chapterId: chapter }
//                             subscribedChapters = [...subscribedChapters, chapterWithPackageId];
//                         })
//                     }
//                 })
//             }
//             dispatch(dispatchReceivedUserData(userData, userIdsInfo, packageDetails, subscribedChapters));
//             if (Object.keys(userData).length && userData.user_info && Object.keys(userData.user_info).length) {
//                 dispatch(dispatchIsValidUserData(true));
//             } else {
//                 dispatch(dispatchIsValidUserData(false));
//             }
//         })
//         .catch(e => {
//             if (e.response && e.response.status == 401) {
//                 localStorage.clear();
//                 window.location.reload();
//             } else {
//                 dispatch(dispatchErrorUserData(e));
//             }
//         })
// }


export const saveUserSession = (data) => dispatch => {

    localStorage.setItem('Bearer', data.token);
    localStorage.setItem('userType', data?.data?.userType);
    dispatch(dispatchUserData(data.data));
}


export const sessionsChecked = (data) => dispatch => {

    // localStorage.setItem('Bearer', data.token);
    // localStorage.setItem('userType', data?.data?.userType);
    dispatch(dispatchSessionsChecked());
}