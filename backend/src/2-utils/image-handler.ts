import VacationModel from "../4-models/vacation-model";
import { v4 as uuid } from "uuid";
import fs from "fs";


async function saveImage(vacation: VacationModel): Promise<void> {

    // save image to disk if exist 
    if (vacation.image) {
        const extension = vacation.image.name.substring(vacation.image.name.lastIndexOf("."));
        vacation.imageName = uuid() + extension;
        await vacation.image.mv("./src/1-assets/images/" + vacation.imageName);
        delete vacation.image;
        
    }

}

async function deleteImage(vacation: VacationModel): Promise<void> {
    console.log('hi')
    // if we have a previous image 
    if (fs.existsSync("./src/1-assets/images/" + vacation.imageName)) {
        console.log('pass the if')

        //delete it :
        fs.unlink("./src/1-assets/images/" + vacation.imageName, (err) =>{
            console.log(err)
        });
    }
}

export default {
    saveImage,
    deleteImage
}

