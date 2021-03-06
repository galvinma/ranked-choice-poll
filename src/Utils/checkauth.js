import axios from 'axios';
import store from '.././Store/store'
import {getAuthStatus, getCurrentUser} from '.././Actions/actions'

export function checkAuth() {
  return new Promise(function(resolve, reject) {
    if (localStorage.getItem('user') === "" || localStorage.getItem('token') === "")
    {
      resolve({allow: false, message: "Missing data in local storage", user: null, token: null})
    }

    axios.post(`${process.env.REACT_APP_RANKED_POLL_API_URI}/api/checktoken`, {
      params: {
        user: localStorage.getItem('user'),
        token: localStorage.getItem('token'),
      }
    })
    .then(function(response) {
      store.dispatch(getAuthStatus({
        auth_status: response.data.allow,
      }))
      store.dispatch(getCurrentUser({
        user: response.data.user,
      }))
      resolve(response)
    })
    .catch(function (error) {
      reject(error)
    });
  })
}
