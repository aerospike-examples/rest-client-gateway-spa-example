import { Auth0DecodedHash, WebAuth } from 'auth0-js';
import autobind from 'autobind-decorator';
import { setJWTToken, setOAuth2 } from '../generated/core/helpers/apiConfiguration';
import { history } from './store';

export class Auth {
    private auth0 = new WebAuth({
        domain: 'arrowplum.auth0.com',
        clientID: 'aK87zePJljNx6s4lUwCjkmXI1eUwremr',
        redirectUri: `${window.location.origin}/callback`,
        responseType: 'token id_token',
        scope: 'openid',
        audience: 'as-rest-demo'
    });

    @autobind
    public login() {
        this.auth0.authorize();
    }

    @autobind
    public handleAuthentication() {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
            } else if (err) {
                history.replace('/');
                console.log(err);
                alert(`Error: ${err.error}. Check the console for further details.`);
            }
        });
    }
    @autobind
    getAccessToken() {
        return localStorage.getItem('accessToken');
    }

    @autobind
    getIdToken() {
        return localStorage.getItem('idToken');
    }

    @autobind
    setSession(authResult: Auth0DecodedHash) {
        let { accessToken, expiresIn, idToken } = authResult;
        // Set isLoggedIn flag in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        const now = Date.now;
        expiresIn = expiresIn || 1000;
        // Set the time that the access token will expire at
        let expiresAt = now() / 1000 + expiresIn;
        localStorage.setItem('accessToken', accessToken!);
        localStorage.setItem('idToken', idToken!);
        localStorage.setItem('expiresAt', '' + expiresAt);
        setJWTToken(accessToken!);
        setOAuth2(accessToken!);
        // navigate to the home route
        history.replace('/');
    }

    @autobind
    renewSession() {
        this.auth0.checkSession({}, (err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
            } else if (err) {
                this.logout();
                console.log(err);
                alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
            }
        });
    }

    @autobind
    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('idToken');
        localStorage.removeItem('expiresAt');
        setJWTToken('');
        // Remove isLoggedIn flag from localStorage
        localStorage.removeItem('isLoggedIn');

        this.auth0.logout({
            returnTo: window.location.origin
        });

        // navigate to the home route
        history.replace('/');
    }
    @autobind
    isAuthenticated() {
        if (!localStorage.getItem('accessToken')) {
            return false;
        }
        // Check whether the current time is past the
        // access token's expiry time
        const expiresStr = localStorage.getItem('expiresAt');
        let expiresAt = expiresStr ? parseInt(expiresStr) : 0;
        return Date.now() / 1000 < expiresAt!;
    }
}
const accessToken = localStorage.getItem('accessToken');
if (accessToken) {
    setJWTToken(accessToken);
    setOAuth2(accessToken);
}
export const auth = new Auth();
