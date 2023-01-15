import { Request } from "express";
import jwt from "jsonwebtoken";
import RoleModel from "../4-models/role-model";
import UserModel from "../4-models/user-model";
import crypto from "crypto"


// create secret key = string for our REST API
const secretKey = "holiday";

function getNewToken(user: UserModel): string {

    // never return password to front 
    delete user.password;

    // create a container for the user obj 
    const container = { user };

    // create expiration date 
    const options = { expiresIn: "6h" }

    // generate token 
    const token = jwt.sign(container, secretKey, options);

    return token;
}



function verifyToken(request: Request): Promise<boolean> {

    //written b4 2015 so have to use/return:  promise
    return new Promise<boolean>((resolve, reject) => {

        try {

            // token format: 
            // authorization header ==> "Bearer the-token"

            // extract header:
            const header = request.header("authorization");

            // if no such header 
            if (!header) {
                resolve(false);
                return;
            }

            // extract token from header 
            const token = header.substring(7);

            // if there is no token 
            if (!token) {
                resolve(false);
                return
            }

            // verify token 
            jwt.verify(token, secretKey, err => {
                // if token is illegal 
                if (err) {
                    resolve(false);
                    return
                }

                // here token must be legal 
                resolve(true);

            })

        }
        catch (err: any) {
            reject(err);
        }


    })

}

async function verifyAdmin(request: Request): Promise<boolean> {

    // first check if user logged in 
    const isLoggedIn = await verifyToken(request);

    // if not logged in 
    if (!isLoggedIn) return false;

    // extract token 
    const header = request.header("authorization");
    const token = header.substring(7);

    // extract container from token 
    const container: any = jwt.decode(token);

    // extract user 
    const user: UserModel = container.user;

    // return true if user is admin otherwise return false 
    return user.roleId === RoleModel.Admin;

}
// secret key for hashing password
const salt = "ThisIsACatWorld";

function hash(plainText: string): string {

    if(!plainText) return null;

    // Hash with salt: 
    const hashedText = crypto.createHmac("sha512", salt).update(plainText).digest("hex");

    return hashedText;

}

export default {
    getNewToken,
    verifyToken,
    verifyAdmin,
    hash
}