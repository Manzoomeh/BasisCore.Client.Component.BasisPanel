export default interface ILogoutOptions {
    url:string;
    cookieName?: string;
    errorIDsForRedirect: Array<number>;
    getDmnTokenUrl: string;
    defaultRedirectUrl: string;
}

