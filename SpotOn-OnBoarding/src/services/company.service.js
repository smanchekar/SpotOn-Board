import axiosInstance from "./http.service";
import { constants } from "../constants";

class CompanyService {
    /**
     * this function will call getCompanies API
     */
    getCompanyList() {
        let url = constants.BASE_URL + "getCompanies";
        return axiosInstance.get(url)
            .then(response => {
                console.log("==response====", response.data);
                if (response.data.status === 200) {
                    return response.data.data;
                }
            })
            .catch(err => {
                console.log("getCompanies err: ", err);
                return err.response.data;
            })
    }

    /**
     * This function will call createCompany API 
     * @param {*} company company Object
     */
    createCompany(company) {
        let url = constants.BASE_URL + "createCompany";
        return axiosInstance.post(url, company)
            .then(response => {
                console.log("===createCompany===", response.data);
                return response;
            })
            .catch(err => {
                console.log(err);
                return err.response.data;
            })
    }

    /**
     * This function will call createCompany API 
     * @param {*} company company Object
     */
    createCompany(company) {
        let url = constants.BASE_URL + "createCompany";
        return axiosInstance.post(url, company)
            .then(response => {
                console.log("===createCompany===", response.data);
                return response.data;
            })
    }
}

export default CompanyService;