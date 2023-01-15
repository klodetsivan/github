import express from "express";
import expressFileUpload from "express-fileupload";
import cors from "cors";
import appConfig from "./2-utils/app-config";
import catchAll from "./3-middleware/catch-all";
import routeNotFound from "./3-middleware/route-not-found";
import vacationsController from "./6-controllers/vacations-controller";
import authController from "./6-controllers/auth-controller";
import sanitize from "./3-middleware/sanitize";
import expressRateLimit from "express-rate-limit";
import helmet from "helmet";

//create express server
const server = express();

// defend against dos attack 
server.use("/api/", expressRateLimit({
    max: 10,
    windowMs: 1000,
    message: "This site is safe"
}));

// helmet defense against malicious headers 
server.use(helmet());

// Limit CORS policy to our front end if data is not public to all world:
server.use(cors({ origin: appConfig.frontEndUrl }));

// create object body - (request.body)
server.use(express.json());

// Sanitize request.body - remove HTML and script tags:
server.use(sanitize);

// create object file- to handle file upload 
server.use(expressFileUpload());

server.use("/api", vacationsController);
server.use("/api", authController);
server.use("*", routeNotFound);
server.use(catchAll);

server.listen(appConfig.port, () => console.log(`Listening on http://localhost:${appConfig.port}`));

