import axios from "axios";
import { authStore } from "../Redux/AuthState";

class InterceptorsService {

    public createInterceptors(): void {
        axios.interceptors.request.use(request => {

            // if we have a token 
            if (authStore.getState().token) {

                // create jwt header with that token 
                request.headers = {
                    authorization: "Bearer " + authStore.getState().token
                }
            }
            return request;
        });
    }

}

const interceptorsService = new InterceptorsService();

export default interceptorsService;