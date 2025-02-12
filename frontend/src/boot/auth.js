const checkLoggedIn = async () => {
    try {
        const user = localStorage.getItem('user');
        if (!user) {
            window.location.href = '/#/login';
            return null;
        }
        return JSON.parse(user);
    } catch (error) {
        window.location.href = '/#/login';
        console.error('Error checking if user is logged in:', error);
        return null;
    }
};

export default checkLoggedIn;