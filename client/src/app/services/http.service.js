import axios from "axios";
import { toast } from "react-toastify";
import configFile from "../config.json";
import authService from "./auth.service";
import localStorageService from "./localStorage.service";

const http = axios.create({ baseURL: configFile.apiEndpoint });

// axios.defaults.baseURL = configFile.apiEndpoint; // настройки по умолчанию, которые будут применяться к каждому запросу.

http.interceptors.request.use(
    // добавляем ".json" до отправки запроса
    async function (config) {
        const expiresDate = localStorageService.getTokenExpiresDate();
        const refreshToken = localStorageService.getRefreshToken();
        const isExpired = refreshToken && expiresDate < Date.now();

        if (configFile.isFireBase) {
            const containSlash = /\/$/gi.test(config.url);
            config.url =
                (containSlash ? config.url.slice(0, -1) : config.url) + ".json";
            // при работе с firebase
            if (isExpired) {
                const data = await authService.refresh();
                // console.log(data);
                localStorageService.setTokens({
                    refreshToken: data.refresh_token,
                    idToken: data.id_token,
                    expiresIn: data.expires_id,
                    localId: data.user_id
                });
            }
            // если accsessToken существует добавляем к квери параметрам новыйпараметр
            const accessToken = localStorageService.getAccessToken();
            if (accessToken) {
                config.params = { ...config.params, auth: accessToken };
            }
        } else {
            // при работе с MongoDB или другой БД на сервере
            if (isExpired) {
                const data = await authService.refresh();
                // console.log(data);
                localStorageService.setTokens(data);
            }
            // если accessToken существует добавляем к квери параметрам новыйпараметр
            const accessToken = localStorageService.getAccessToken();
            if (accessToken) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${accessToken}`
                };
            }
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

function transformData(data) {
    return data && !data._id
        ? Object.keys(data).map((key) => ({ ...data[key] }))
        : data; // трансформация данных из объекта в массив
}

http.interceptors.response.use(
    // обрабатываем данные, получ  с сервера, изменяем их, если требуется и возвращаем обновленные
    (res) => {
        if (configFile.isFireBase) {
            res.data = { content: transformData(res.data) };
            //  console.log(res.data);
        }
        res.data = { content: res.data };
        // console.log("res", res);
        // console.log("res.data", res.data);
        return res;
    },

    // обрабатываем неожидаемую ошибку в случае ее возникновения
    function (error) {
        const expectedErrors =
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500;
        if (!expectedErrors) {
            console.log(error);
            toast.error("Something was wrong. Try it later");
            // console.log("Unexpected error");
        }
        return Promise.reject(error);
    }
);

const httpService = {
    get: http.get,
    post: http.post,
    put: http.put,
    delete: http.delete,
    patch: http.patch
};

export default httpService;
