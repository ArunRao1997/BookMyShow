import { axiosInstance } from ".";

export const AddTheatre = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "/api/theatres/add-theatre",
            payload
        );
        return response.data;
    } catch (error) {
        return error.response;
    }
};

// Get all theatres
export const GetAllTheatres = async () => {
    try {
        const response = await axiosInstance.get("/api/theatres/get-all-theatres");
        return response.data;
    } catch (error) {
        return error.response;
    }
};

// Get all theatres by owner
export const GetAllTheatresByOwner = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "/api/theatres/get-all-theatres-by-owner",
            payload
        );
        return response.data;
    } catch (error) {
        return error.response;
    }
};

// Update a Movie
export const UpdateTheatre = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/theatres/update-theatre', payload)
        return response.data
    } catch (error) {
        return error
    }
};

// Delete a Movie
export const DeleteTheatre = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/theatres/delete-theatre', payload)
        return response.data
    } catch (error) {
        return error
    }
};

// Get all theatres for a movie
export const GetAllTheatresByMovies = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "/api/theatres/get-all-theatres-by-movie",
            payload
        );
        return response.data;
    } catch (error) {
        return error.response;
    }
};
