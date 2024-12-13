import request from '@/utils/request'

// 登录
export function userLogin(userName,password) {
    return request({
        url: '/login',
        method: 'post',
        data: {'userName':userName,'password':password}
    })
}

export function userRegister(username,nickName,email,password) {
    return request({
        url: '/user/register',
        method: 'post',
        data: {"username":username,"nickName":nickName,"email":email,"password":password}
    })
}

export function logout() {
    return request({
        url: '/logout',
        method: 'post',
        headers: {
            isToken :true
        }
    })
}

export function getUserInfo(userId) {
    return request ({
        url: '/user/userInfo',
        method: 'get',
        params: {"userId":userId},
        headers: {
            isToken :true
        }
    })
}

export function saveUserInfo(userinfo) {
    return request({
        url: '/user/userInfo',
        method: 'put',
        data: userinfo,
        headers: {
            isToken :true
        }
    })
}