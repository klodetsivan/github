// general config 
class AppConfig {

}

// development config 
class DevelopmentConfig extends AppConfig {

    // Database: 
    public isDevelopment = true;
    public isProduction = false;
    public host = "localhost"; // Computer name/address of our database
    public user = "root"; // Database user
    public password = ""; // Database password
    public database = "vacations"; // Database name
    public port = 3005; // Database port
    public frontEndUrl = "http://localhost:3000"; 
}
// production config 
class ProductionConfig extends AppConfig {
    //would be different
    // Database: 
    public isDevelopment = false;
    public isProduction = true;
    public host = ""; // Computer name/address of our database
    public user = ""; // Database user
    public password = ""; // Database password
    public database = ""; // Database name
    public port = 0;
    public frontEndUrl = "";
}

const appConfig = (process.env.NODE_ENV === "production") ? new ProductionConfig() : new DevelopmentConfig();

export default appConfig;