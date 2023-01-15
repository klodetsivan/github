import { OkPacket } from "mysql";
import cyber from "../2-utils/cyber";
import dal from "../2-utils/dal";
import CredentialsModel from "../4-models/credentials-model";
import { ValidationErrorModel, UnauthorizedErrorModel } from "../4-models/error-models";
import RoleModel from "../4-models/role-model";
import UserModel from "../4-models/user-model";

async function register(user: UserModel): Promise<string> {

    delete user.roleId

    // validation
    const error = user.validate();
    // console.log(user);
    if (error) throw new ValidationErrorModel(error);

    // check if username taken
    if (await isUsernameTaken(user.username)) throw new ValidationErrorModel(`Username ${user.username} already taken`);

    // hash password
    user.password = cyber.hash(user.password)

    // add new user to collection 
    // insertUser(user);
  
    // save back to file 
    // const info: OkPacket = await dal.execute(sql, [user.firstName, user.lastName, user.username, user.password, RoleModel.User]);
    // user.id = info.insertId
   
    const updatedUser =  await insertUser(user)
    
    

    // generate token:
    const token = cyber.getNewToken(updatedUser[0]);

    return token;

}

async function login(credentials: CredentialsModel): Promise<string> {

    //validation
    const error = credentials.validate();

    if (error) throw new ValidationErrorModel(error);

    // Hash password:
    credentials.password = cyber.hash(credentials.password);

    // SQL Injection:
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;

    const users = await dal.execute(sql, [credentials.username, credentials.password]);

    //if user not exist
    if (users.length === 0) throw new UnauthorizedErrorModel("Incorrect username or password");
    const user = users[0];

    // generate token 
    const token = cyber.getNewToken(user);

    return token;

}
// check if username taken
async function isUsernameTaken(username: string): Promise<boolean> {
    const sql = `SELECT COUNT(*) FROM users WHERE username = ?`;
    const count = await dal.execute(sql, [username])[0];
    return count > 0;
}


async function insertUser(user: UserModel): Promise<UserModel> {
    // add new user to collection 
    let sql = `
      INSERT INTO users VALUES(
          DEFAULT,
          ?, ?, ?, ?, ?
      )
      `
    // save back to file 
    const { insertId } = await dal.execute(sql, [user.firstName, user.lastName, user.username, user.password, RoleModel.User]);
    if (!insertId) throw new UnauthorizedErrorModel("Insert user failed");
    let sqlb = `SELECT U.*,R.role FROM users AS U JOIN roles AS R ON
     U.roleId = R.roleId WHERE U.roleId = ? AND U.id = ?`
    const updatedUser = await dal.execute(sqlb, ['user', insertId])
    return updatedUser ;
}

export default {
    register,
    login

}