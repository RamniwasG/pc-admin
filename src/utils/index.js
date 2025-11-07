export const getUserToken = () => {
    return localStorage.getItem('token')
}

export const setUserToken = (token) => {
    return localStorage.setItem('token', token)
}

export const getUserData = () => {
    const data = localStorage.getItem('userData')
    return data ? JSON.parse(data) : {};
}

export const setUserData = (user) => {
    return localStorage.setItem('userData', JSON.stringify(user))
}

export const clearLoginCredentials = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
}

// Capitalize each word (optional enhancement)
export const capitalizeWords = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

//With optional chaining (handles empty strings safely)
export const capitalize = (str) => str?.[0]?.toUpperCase() + str?.slice(1) || "";

export const formToJSON = (formData) => {
  const obj = {};
  formData.forEach((value, key) => {
    // handle multiple entries with same key
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  });
  return obj;
};