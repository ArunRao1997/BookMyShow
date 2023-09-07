import { axiosInstance } from ".";

//Add a show
export const AddShow = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "/api/shows/add-show",
            payload
        );
        return response.data;
    } catch (error) {
        return error.response;
    }
};

//Get shows by theatre
export const GetAllShowsByTheatre = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "/api/shows/get-all-shows-by-theatre",
            payload
        );
        return response.data;
    } catch (error) {
        return error.response;
    }
};

//Delete a show
export const DeleteShow = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/shows/delete-show', payload)
        return response.data
    } catch (error) {
        return error
    }
};

//Get show by id
export const GetShowById = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "/api/shows/get-show-by-id",
            payload
        );
        return response.data;
    } catch (error) {
        return error.response;
    }
}
