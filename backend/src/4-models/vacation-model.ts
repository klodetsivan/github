
import Joi from "joi";
import { UploadedFile } from "express-fileupload"
import RoleModel from "./role-model";
import UserModel from "./user-model";

class VacationModel {

    public vacationId: number;
    public description: string;
    public destination: string;
    public image: UploadedFile;  // The file uploaded by the front
    public imageName: string;  // the name of the image
    public checkIn: string;
    public checkOut: string;
    public price: string;
    public followersCount: number;

    public constructor(vacation: VacationModel) {
        this.vacationId = vacation.vacationId;
        this.description = vacation.description;
        this.destination = vacation.destination;
        this.image = vacation.image;
        this.imageName = vacation.imageName;
        this.checkIn = vacation.checkIn;
        this.checkOut = vacation.checkOut;
        this.price = vacation.price;
        this.followersCount = vacation.followersCount;
    }

    // validation schema obj once for any vacation model
    public static validationSchema = Joi.object({
        vacationId: Joi.number().optional().integer().positive(),
        description: Joi.string().required().min(2).max(500),
        destination: Joi.string().required().min(2).max(300),
        image: Joi.object().optional(),
        imageName: Joi.string().optional(),
        checkIn: Joi.string().required().min(4).max(20),
        checkOut: Joi.string().required().min(4).max(20),
        price: Joi.string().required().min(3).max(100000),
        followersCount: Joi.number()

    });

     //validate current obj (return undefined if no error, or message if there is an error)
    public validate(): string {
        const result = VacationModel.validationSchema.validate(this);
        return result.error?.message
    }
}

export default VacationModel;