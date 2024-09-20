export const authenticate = (data, next) => {
    if(window !== 'undefined'){
        localStorage.setItem('token', JSON.stringify(data.token));
    }
    next();
}

export const getToken = (next) => {
    if(window !== 'undefined'){
        if(localStorage.getItem('token')){
            return JSON.parse(localStorage.getItem('token'));
        }else{
            return false;
        }    
    }
    next();
}

export const getUser = (next) => {
    if(window !== 'undefined'){
        if(localStorage.getItem('token')){
            return JSON.parse(localStorage.getItem('token'));
        }else{
            return false;
        }    
    }
    next();
}

export const logout = (next) => {
    if(window !== 'undefined'){
        localStorage.removeItem('token');
    }
    next();
}