export const setAuthenticationStateInLocalStorage = (isAuthenticated) => {
    localStorage.setItem('graphiql:isAuthenticated', JSON.stringify(isAuthenticated));
};

export const getAuthenticationStateFromLocalStorage = () => {
    const storedValue = localStorage.getItem('graphiql:isAuthenticated');
    return storedValue ? JSON.parse(storedValue) : true;
};