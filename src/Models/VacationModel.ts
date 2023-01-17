class VacationsModel {

    public vacationId: number;
    public description: string;
    public destination: string;
    public checkIn: string;
    public checkOut: string;
    public price: string ;
    public followersCount: number;
    public imageName: string;
    public image: FileList;
    public isFollowing?: number;


    public static descriptionValidation = {
        required: { value: true, message: "Missing description" },
        minLength: { value: 3, message: "description too short" },
        maxLength: { value: 10000, message: "description too long" },
    }
    public static destinationValidation = {
        required: { value: true, message: "Missing destination" },
        minLength: { value: 0, message: "destination too low" },
        maxLength: { value: 100, message: "destination too high" },
    }
    public static checkInValidation = {
        required: { value: true, message: "Missing check-in date" },
        
    }
    public static checkOutValidation = {
        required: { value: true, message: "Missing check-out date" },
    }
    public static priceValidation = {
        required: { value: true, message: "Missing price" },
        min: { value: 0, message: "price too low" },
        max: { value: 10000, message: "price too high" },
    }
  
}

export default VacationsModel;