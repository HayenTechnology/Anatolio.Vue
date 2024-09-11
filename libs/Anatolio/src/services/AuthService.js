import axios from 'axios';

export default class AuthService {
    async login(identity, password, rememberMe) {
        try {
            const response = await axios.post('/api/auth/login', {
                Identity: identity,
                Password: password,
                RememberMe: rememberMe
            });
            this.authenticate(response);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    async register(companyName, email, password) {
        try {
            const response = await axios.post('/api/auth/registerCompany', {
                CompanyName: companyName,
                Email: email,
                Password: password
            });
            this.authenticate(response);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    async resetPassword(email) {
        try {
            await axios.post('/api/auth/resetPassword', {
                Email: email
            });
            // Handle the response here
        } catch (error) {
            return Promise.reject(error);
        }
    }
    reloadCache() {
        axios.get('/api/company').then((response) => {
            this.setCompany(response);
        });
        axios.get('/api/auth/GeUserRole').then((response) => {
            this.setRoles(response);
        });
    }
    logout(router) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('company');
        localStorage.removeItem('roles');

        router.push('/auth/login');
    }
    getUser() {
        var user = localStorage.getItem('user');
        if (user) {
            user = JSON.parse(user);
            user.Roles = this.getRoles();
            return user;
        }
        return {};
    }
    getCompany() {
        var data = localStorage.getItem('company');
        if (data) {
            return JSON.parse(data);
        }
        return {};
    }
    getRoles() {
        var data = localStorage.getItem('roles');
        if (data) {
            return JSON.parse(data);
        }
        return [];
    }
    getToken() {
        return localStorage.getItem('token');
    }
    authenticate(data) {
        localStorage.setItem('token', data.token);
        this.setRoles(data.roles);
        this.setCompany(data.company);
        this.setUser(data.user);
        this.reloadCache();
    }
    setCompany(data) {
        localStorage.setItem('company', JSON.stringify(data));
    }
    setUser(data) {
        localStorage.setItem('user', JSON.stringify(data));
    }
    setRoles(data) {
        localStorage.setItem('roles', JSON.stringify(data));
    }
    checkRole(roles) {
        var currentUser = this.getUser();
        for (var i = 0; i < currentUser.Roles.length; i++) {
            if (!roles || roles == []) {
                return true;
            }

            if (roles.includes(currentUser.Roles[i])) {
                return true;
            }
        }
        return false;
    }
    chechIsAuthenticated(router) {
        try {
            var token = this.getToken();

            if (!token) {
                return false;
            }

            axios
                .get('/api/secure')
                .then((response) => {
                    if (!response?.data?.data) {
                        this.logout(router);
                    }
                })
                .catch(() => {
                    this.logout(router);
                });
            return true;
        } catch (error) {
            return false;
        }
    }
}
