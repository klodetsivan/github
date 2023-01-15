import express, { Request, Response, NextFunction } from "express";
import path from "path";
import verifyAdmin from "../3-middleware/verify-admin";
import verifyLoggedIn from "../3-middleware/verify-logged-in";
import VacationModel from "../4-models/vacation-model";
import vacationsLogic from "../5-logic/vacations-logic";


const router = express.Router(); // Capital R

// Get vacations for user
// GET http://localhost:3005/api/vacations
router.get("/vacations/:userId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = +request.params.userId

        const vacations = await vacationsLogic.getVacationsForUser(userId);

        console.log('vacations from getVa controller ', vacations);


        response.json(vacations);
    }
    catch (err: any) {
        next(err);
    }
});

// Get one vacation
// GET http://localhost:3005/api/vacations/:vacationId
router.get("/vacations/:vacationId([0-9]+)", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const vacationId = +request.params.vacationId
        const vacation = await vacationsLogic.getOneVacation(vacationId);
        response.json(vacation);
    }
    catch (err: any) {
        next(err);
    }
});

// Add vacation
// POST http://localhost:3005/api/vacations
router.post("/vacations", async (request: Request, response: Response, next: NextFunction) => {
    try {
        //take uploaded file and set it to the body
        request.body.image = request.files?.image;

        const vacation = new VacationModel(request.body);
        const addedVacation = await vacationsLogic.addVacation(vacation)
        response.status(201).json(addedVacation);
    }
    catch (err: any) {
        next(err);
    }
});

// Update vacation
// PUT http://localhost:3005/api/vacations/:vacationId
router.put("/vacations/:vacationId([0-9]+)", [verifyAdmin], async (request: Request, response: Response, next: NextFunction) => {
    try {

        const id = +request.params.vacationId;
        request.body.vacationId = id;

        // take uploaded file and set it to the body 
        request.body.image = request.files?.image

        const vacation = new VacationModel(request.body);
        const updatedVacation = await vacationsLogic.updateVacation(vacation);
        response.json(updatedVacation);
    }
    catch (err: any) {
        next(err)
    }
});

// Delete vacation
// DELETE http://localhost:3005/api/vacations/:vacationId
router.delete("/vacations/:vacationId([0-9]+)", [verifyAdmin], async (request: Request, response: Response, next: NextFunction) => {
    try {
        const vacationId = +request.params.vacationId;
        await vacationsLogic.deleteVacation(vacationId);
        response.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});

// Get image
// GET http://localhost:3005/api/vacations/images/:imageName
router.get("/vacations/images/:imageName", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const imageName = request.params.imageName;
        const absolutePath = path.join(__dirname, "..", "1-assets", "images", imageName);

        console.log(absolutePath);

        response.sendFile(absolutePath);
    }
    catch (err: any) {
        next(err);
    }
});

// Add follow to vacation
// POST http://localhost:3005/api/follow/:vacationId/:userId
router.post("/follow/:vacationId/:userId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // get vacationId 
        const vacationId = +request.params.vacationId;
        // get userId 
        const userId = +request.params.userId;
        // send them to function toggle - add follow to vacation
        await vacationsLogic.followToggle(vacationId, userId)
        // after follow, get back vacations state for specific user
        const vacations = await vacationsLogic.getVacationsForUser(userId);
        console.log('vacations from follow controller ', vacations);

        response.status(201).json(vacations);
    }
    catch (err: any) {
        next(err);
    }
});

// delete follow from vacation
//// DELETE http://localhost:3005/api/follow/:vacationId/:userId
router.delete("/follow/:vacationId/:userId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // get vacationId 
        const vacationId = +request.params.vacationId;
        // get userId 
        const userId = +request.params.userId;
        // send them to function unToggle - checks if user is following a vacation and remove follow
        await vacationsLogic.unFollowToggle(vacationId, userId)
        // after unFollow, get back vacations state for specific user
        const vacations = await vacationsLogic.getVacationsForUser(userId);
        console.log('vacations from unfollow controller ', vacations);
        
        response.status(201).json(vacations);
    }
    catch (err: any) {
        next(err);
    }
});



export default router;