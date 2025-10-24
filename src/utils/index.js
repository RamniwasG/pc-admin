export const getUserToken = () => {
    return localStorage.getItem('token')
}

export const setUserToken = (token) => {
    return localStorage.setItem('token', token)
}

export const getUserData = () => {
    const data = localStorage.getItem('userData') || {}
    return JSON.parse(data)
}

export const setUserData = (user) => {
    return localStorage.setItem('userData', JSON.stringify(user))
}

export const clearLoginCredentials = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
}