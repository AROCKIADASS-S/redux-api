import axios from "axios";
import { AddRequest, RemoveRequest, UpdateRequest, getAllRequestFail, getAllRequestSuccess, getbycodeSuccess, makeRequest } from "./Action"
import { toast } from "react-toastify";

export const GetAllCompanys = () => {
    return (dispatch) => {
        dispatch(makeRequest());
        setTimeout(()=>{
            axios.get("https://jsonplaceholder.typicode.com/users").then(res => {
                const _list = res.data;
                dispatch(getAllRequestSuccess(_list));
            }).catch(err => {
                dispatch(getAllRequestFail(err.message));
            });
        },1000)
       
    }
}

export const GetCompanybycode = (code) => {
    return (dispatch) => {
        //dispatch(makeRequest());
        axios.get("https://jsonplaceholder.typicode.com/users/"+code).then(res => {
            const _obj = res.data;
            dispatch(getbycodeSuccess(_obj));
        }).catch(err => {
            toast.error('Failed to fetch the data')
        });
    }
}

export const CreateCompany = (data) => {
    return (dispatch) => {
        axios.post("https://jsonplaceholder.typicode.com/users", data).then(res => {
            dispatch(AddRequest(data));
            toast.success('Data created successfully.')
        }).catch(err => {
            toast.error('Failed to create data due to :' + err.message)
        });
    }
}

export const UpdateCompany = (data) => {
    return (dispatch) => {
        axios.put("https://jsonplaceholder.typicode.com/users/"+data.id, data).then(res => {
            dispatch(UpdateRequest(data));
            toast.success('Data updated successfully.')
        }).catch(err => {
            toast.error('Failed to update data due to :' + err.message)
        });
    }
}

export const RemoveCompany = (code) => {
    return (dispatch) => {
        axios.delete("https://jsonplaceholder.typicode.com/users/"+code).then(res => {
            dispatch(RemoveRequest(code));
            toast.success('Data Removed successfully.')
        }).catch(err => {
            toast.error('Failed to remove data due to :' + err.message)
        });
    }
}


