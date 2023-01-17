class Config {
    public vacationsUrl = "http://localhost:3005/api/vacations/";
    public registerUrl = "http://localhost:3005/api/auth/register/";
    public loginUrl = "http://localhost:3005/api/auth/login/";
    public vacationsImagesUrl = "http://localhost:3005/api/vacations/images/";
    public followUrl = "http://localhost:3005/api/follow/";

}

const appConfig = new Config(); // Singleton

export default appConfig;
