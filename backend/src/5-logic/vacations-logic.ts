import { OkPacket } from "mysql";
import dal from "../2-utils/dal";
import { ResourceNotFoundErrorModel, ValidationErrorModel } from "../4-models/error-models";
import VacationModel from "../4-models/vacation-model";
import imageHandler from "../2-utils/image-handler";

// get one vacation 
async function getOneVacation(vacationId: number): Promise<VacationModel> {

    const sql = `
       SELECT V.* FROM vacations AS V WHERE V.vacationId = ?
`
    const vacations = await dal.execute(sql, [vacationId]);
    // if vacation not found 
    if (vacations.length === 0) throw new ResourceNotFoundErrorModel(vacationId);
    const vacation = vacations[0];

    return vacation;
}

// add vacation
async function addVacation(vacation: VacationModel): Promise<VacationModel> {

    // validation 
    const errors = vacation.validate();
    if (errors) throw new ValidationErrorModel(errors);

    imageHandler.saveImage(vacation);

    const sql = `
                 INSERT INTO vacations VALUES(DEFAULT,?, ?, ?, ?, ?, ?, ?)
                 `;
    const info: OkPacket = await dal.execute(sql, [vacation.description, vacation.destination, vacation.imageName, vacation.checkIn, vacation.checkOut, vacation.price, vacation.followersCount]);
    vacation.vacationId = info.insertId;
    return vacation;

}

// update vacation
async function updateVacation(vacation: VacationModel): Promise<VacationModel> {

    // validation 
    const errors = vacation.validate();
    if (errors) throw new ValidationErrorModel(errors);

    if (vacation.image) {
        imageHandler.deleteImage(vacation);

        imageHandler.saveImage(vacation);

    } else {
        const prevImage = await getOneVacation(vacation.vacationId);
        vacation.imageName = prevImage.imageName
    }

    // update followersCount?
    const sql = `
                UPDATE vacations SET
                description =  ?,
                destination = ?,
                imageName = ?,
                checkIn = ?,
                checkOut = ?,
                price = ?,
                followersCount = ? 
                WHERE vacationId = ?
                `;

    const info: OkPacket = await dal.execute(sql, [vacation.description, vacation.destination, vacation.imageName, vacation.checkIn, vacation.checkOut, vacation.price, vacation.followersCount, vacation.vacationId]);
    if (info.affectedRows === 0) throw new ResourceNotFoundErrorModel(vacation.vacationId);

    return vacation;
}


// delete vacation
async function deleteVacation(vacationId: number): Promise<void> {
    const vacation = await getOneVacation(vacationId)

    // delete image 
    imageHandler.deleteImage(vacation);

    const sql2 = `
    DELETE FROM vacations WHERE vacationId = ?
    `;
    await dal.execute(sql2, [vacationId]);
}

async function getVacationsForUser(userId: number) {

    const sql = `
              SELECT DISTINCT
              V.vacationId,
              V.description,
              V.destination,
              V.imageName,
              DATE_FORMAT(checkIn,'%d/%m/%Y') AS checkIn,
              DATE_FORMAT(checkOut,'%d/%m/%Y') AS checkOut,
              V.price,
              V.followersCount,
              EXISTS(SELECT * FROM followers WHERE vacationId = F.vacationId AND userId = ?) AS isFollowing,
              COUNT(F.userId) AS followersCount
              FROM vacations AS V LEFT JOIN followers AS F
              ON V.vacationId = F.vacationId
              GROUP BY vacationId
              ORDER BY checkIn DESC
             `
    const vacations = await dal.execute(sql, [userId]);

    return vacations

}


// follow a vacation
async function followToggle(vacationId: number, userId: number): Promise<void> {
    console.log(userId, vacationId);

    const sql = `
                INSERT INTO followers VALUES(?,?)
                `
    await dal.execute(sql, [userId, vacationId]);

}

// unFollow vacation
async function unFollowToggle(vacationId: number, userId: number): Promise<void> {
  
    const sql = `
                DELETE FROM followers WHERE userId = ? AND vacationId = ?
                `
    await dal.execute(sql, [userId, vacationId]);
}

export default {
    addVacation,
    deleteVacation,
    getOneVacation,
    updateVacation,
    getVacationsForUser,
    followToggle,
    unFollowToggle
};

