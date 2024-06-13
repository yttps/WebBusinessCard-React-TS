import axios from 'axios';
// import { GetAllCompany } from '@/Model/GetAllCompany';

// const hostUrl = " https://ab3d-1-46-31-5.ngrok-free.app";
const url = "http://localhost:8080";   //use host 
const axiosHeaders = {
    "ngrok-skip-browser-warning": "ngrok-skip-browser-warning",
}

export class CompanyApi {

    async GetAllCompany() {

        try {

            const res = await axios.get(url + '/companies', {
                headers: axiosHeaders,
            });
            const companyData = res.data;
            console.log('in context', companyData);
            return companyData;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async GetDataCompanyById(id: string) {

        try {

            const res = await axios.get(`${url}/companies/${id}`, {
                headers: axiosHeaders,
            });

            const companyDataById = res.data;

            console.log('in context', companyDataById);
            return companyDataById;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async AddDataCompany(
        email: string, password: string,
        businessType: string, name: string, phoneNumber: string,
        website: string, yearFounded: string, subdistrict: string,
        district: string, province: string, country: string) {

        const dataCompany = {
            email: email,
            password: password,
            businessType: businessType,
            name: name,
            phoneNumber: phoneNumber,
            website: website,
            yearFounded: yearFounded,
            subdistrict: subdistrict,
            district: district,
            province: province,
            country: country
        }

        try {


            // const res = await fetch.post(`${url}/companies`, dataCompany, {
            //     headers: axiosHeaders,
            // });

            const res = await fetch(`${url}/companies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataCompany)
            });

            console.log('in context', res.status);
            return res.status;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}