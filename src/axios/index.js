/**
 * Created by hao.cheng on 2017/4/16.
 */
import axios from 'axios';
import { get, post } from './tools';
import * as config from './config';

export const getPros = () => axios.post('http://api.xitu.io/resources/github', {
    category: "trending",
    period: "day",
    lang: "javascript",
    offset: 0,
    limit: 30
}).then(function (response) {
    console.log(response);
    return response.data;
}).catch(function (error) {
    console.log(error);
});

// 管理员权限获取
export const admin = () => get({url: config.NODE_SERVER + '/auth/admin'});

// 访问权限获取
// export const guest = () => get({url: config.MOCK_AUTH_VISITOR});
export const guest = () => get({url: config.NODE_SERVER + '/auth/visitor'});

export const addManager = (data) => post({
    url: config.NODE_SERVER + '/manager/add',
    data: data
});

export const managerList = () => get({url: config.NODE_SERVER + '/manager/all'});

export const getManagerById = (id) => get({url: config.NODE_SERVER + '/manager/'+id});

export const editManager = (data) => post({
    url: config.NODE_SERVER + '/manager/update',
    data: data
});