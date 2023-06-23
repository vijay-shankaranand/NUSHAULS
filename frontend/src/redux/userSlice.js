import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  firstName: "",
  image: "",
  lastName: "",
  _id: "",
  role:""
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRedux: (state, action) => {
      console.log(action.payload.data);
      //   state.user = action.payload.data;
      state._id = action.payload.data._id;
      state.firstName = action.payload.data.firstName;
      state.lastName = action.payload.data.lastName;
      state.email = action.payload.data.email;
      state.image = action.payload.data.image;
      state.role = action.payload.data.role;
      localStorage.setItem('authState', JSON.stringify(action.payload.data));
    },
    logoutRedux: (state, action) => {
      state._id = "";
      state.firstName = "";
      state.lastName = "";
      state.email = "";
      state.image = "";
      state.role = "";
      localStorage.removeItem('authState')
      
    },
  },
});


export const checkAuthState = () => (dispatch) => {
  const authState = localStorage.getItem('authState');

  if (authState) {
    try {
      const user = JSON.parse(authState);
      dispatch(loginRedux({ data: user }));
    } catch (error) {
      console.error('Error parsing authState:', error);
      dispatch(logoutRedux());
    }
  } else {
    dispatch(logoutRedux());
  }
};

export const { loginRedux ,logoutRedux} = userSlice.actions;

export default userSlice.reducer;
