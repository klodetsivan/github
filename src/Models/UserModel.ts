
class UserModel {

    public id: number;
    public firstName: string;;
    public lastName: string;
    public username: string;
    public password: string;
    public roleId: string;
   
  
    public static firstNameValidation = {
        required: { value: true, message: "Missing first name" },
        minLength: { value: 3, message: "First name too short" },
        maxLength: { value: 20, message: "First name too long" },
    }
    public static lastNameValidation = {
        required: { value: true, message: "Missing last name" },
        minLength: { value: 3, message: "last name too short" },
        maxLength: { value: 20, message: "last name too long" },
    }

}

export default UserModel;