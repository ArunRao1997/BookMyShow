const { axiosInstance } = require(".");

// Regsiter a new User

export const RegisterUser = async (payload)=>{
   try {
        const response = await axiosInstance.post('api/users/register' , payload)
        return response.data
   } catch (error) {
      return error
   }
}

// Logins a registered user

export const LoginUser = async (payload)=>{
   try {
      const response = await axiosInstance.post('api/users/login' , payload)
      return response.data
 } catch (error) {
    return error
 }
}

//get Current User
export const GetCurrentUser = async () => {
   try {
      // Dynamically set the Authorization header just before making the request
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
      const response = await axiosInstance.get('/api/users/get-current-user');
      return response.data;
   } catch (error) {
       throw error;
   }
}