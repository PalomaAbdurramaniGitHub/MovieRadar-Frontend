export const authenticate = (data, next) => {
    if(window !== 'undefined'){
        sessionStorage.setItem('token', JSON.stringify(data.token));
    }
    next();
}

export const getToken = (next) => {
    if(window !== 'undefined'){
        if(sessionStorage.getItem('token')){
            return JSON.parse(sessionStorage.getItem('token'));
        }else{
            return false;
        }    
    }
    next();
}

export const getUser = (next) => {
    if(window !== 'undefined'){
        if(sessionStorage.getItem('token')){
            return JSON.parse(sessionStorage.getItem('token'));
        }else{
            return false;
        }    
    }
    next();
}

export const logout = (next) => {
    if(window !== 'undefined'){
        sessionStorage.removeItem('token');
    }
    next();
}