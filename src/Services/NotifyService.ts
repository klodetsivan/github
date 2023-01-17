import { Notyf } from "notyf";   //npm i notyf

class NotifyService {

    private notify = new Notyf({
        duration: 3000, // display duration 
        position: { x: "center", y: "top" }, // message location 
        dismissible: true  // can user click on x
    });

    public success(message: string): void {
        this.notify.success(message)
    }

    public error(err: any): void {
        const message = this.extractErrorMessage(err);
        this.notify.error(message)
    }

    private extractErrorMessage(err: any): string {
        //front throws some error:
        if (typeof err === "string") return err;
        // back throws string : 
        if (typeof err.response?.data === "string") return err.response.data
        // back throws string[]
        if (Array.isArray(err.response?.data)) return err.response.data[0];
        // front throws new error: 
        if (typeof err.message === "string") return err.message;

        return "some error occurred, please try again"
    }

}

const notifyService = new NotifyService();

export default notifyService;