const { axiosInstance } = require('.')

// Add a Movie
export const AddMovie = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/movies/add-movie', payload)
        return response.data
    } catch (error) {
        return error
    }
}

// Get All Movies
export const GetAllMovies = async (payload) => {
    try {
        const response = await axiosInstance.get('/api/movies/get-all-movies', payload)
        return response.data
    } catch (error) {
        return error
    }
}

// Update a Movie
export const UpdateMovie = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/movies/update-movie', payload)
        return response.data
    } catch (error) {
        return error
    }
}

// Delete a Movie
export const DeleteMovie = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/movies/delete-movie', payload)
        return response.data
    } catch (error) {
        return error
    }
}

//Get a movie by id
export const GetMovieById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/movies/get-movie-by-id/${id}`);
        return response.data;
    } catch (error) {
        return error.response;
    }
}