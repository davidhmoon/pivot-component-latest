import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import qs from 'qs';
import { returnToLogin } from '../utils/functions';
import Notiflix from 'notiflix';

const validatUrl = (url: string) => {
    return (
        url?.includes('token') ||
        url?.includes('administration/authOptions') ||
        url?.includes('login') ||
        url?.includes('otp') ||
        url?.includes('passwordlessEmail/link') ||
        url?.includes('/changePasswordOut') ||
        url?.includes('/changePasswordEmail')
    );
};

function getEnv() {
    if (localStorage.getItem('env') === 'dev' || window.location.host.indexOf('localhost') > -1) {
        //return `http://localhost:8000`;// `https://lrm-api-dev.cheilbidx.io`;
        return `https://lrm-api-dev.cheilbidx.io`;
    } else {
        return `https://lrm-api-prod.cheilbidx.io`;
    }
}

const url = getEnv();
console.log('url', url);
export const axiosInstance = axios.create({
    baseURL: url,
});

axiosInstance.interceptors.request.use((request: InternalAxiosRequestConfig) => {
    const isLogin = validatUrl(request?.url || '');
    if (!isLogin) {
        request.headers['Authorization'] = `Bearer ${localStorage.getItem('tokenkey')}`;
    }
    request.headers['Content-Type'] = 'application/json';
    request.paramsSerializer = (params) =>
        qs.stringify(params, {
            skipNulls: true,
            encoder: (str) => {
                return encodeURI(str);
            },
        });
    return request;
});

axiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response;
    },
    (err: AxiosError) => {
        //console.log("error in interaction with token", err);
        if (err.response?.status === 401)
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            return returnToLogin(null, false, false, false);
        else {
            Notiflix.Notify.failure('Error with the request');
            return err;
        }
    }
);

// export const PrivateInterceptor = () => {
//     console.log("INTERCEPTOR",localStorage.getItem('tokenkey'))
//     if (localStorage.getItem('tokenkey')) {

//         axios.interceptors.request.use((request: InternalAxiosRequestConfig) => {
//             const isLogin = validatUrl(request?.url || "");
//             if (!isLogin) {
//                 request.headers['Authorization'] = `Bearer ${localStorage.getItem("tokenkey")}`;
//             }
//             request.headers['Content-Type'] = 'application/json';
//             request.paramsSerializer = (params) =>
//                 qs.stringify(params, {
//                     skipNulls: true,
//                     encoder: (str) => {
//                         return encodeURI(str);
//                     },
//                 });
//             return request;
//         });

//         axios.interceptors.response.use(
//             (response: AxiosResponse) => {
//                 // Any status code that lie within the range of 2xx cause this function to trigger
//                 return response;
//             },
//             (err: AxiosError) => {
//                 console.log("error in interaction with token", err);
//                 if (err.response?.status === 401)
//                     // Any status codes that falls outside the range of 2xx cause this function to trigger
//                     return returnToLogin(null, false, false, false);
//                 else {
//                     Notiflix.Notify.failure("Error with the request: " + err?.toString());
//                     return err;
//                 }
//             }
//         );
//     }
//     else {
//         axios.interceptors.request.use((request: InternalAxiosRequestConfig) => {
//             const isLogin = validatUrl(request?.url || "");
//             if (!isLogin) {
//                 request.headers['Authorization'] = `Bearer ${localStorage.getItem("tokenkey")}`;
//             }
//             request.headers['Content-Type'] = 'application/json';
//             request.paramsSerializer = (params) =>
//                 qs.stringify(params, {
//                     skipNulls: true,
//                     encoder: (str) => {
//                         return encodeURI(str);
//                     },
//                 });
//             return request;
//         });
//         axios.interceptors.response.use(
//             (response: AxiosResponse) => {
//                 // Any status code that lie within the range of 2xx cause this function to trigger
//                 return response;
//             },
//             (err: AxiosError) => {
//                 console.log("error in interaction no token", err);
//                 // Any status codes that falls outside the range of 2xx cause this function to trigger
//                 if (err.response?.status === 401)
//                     return returnToLogin(null, false, false, false);
//                     else {
//                         Notiflix.Notify.failure("Error with the request: " + err?.toString());
//                         return err;
//                     }
//             }
//         );
//     }
// };
