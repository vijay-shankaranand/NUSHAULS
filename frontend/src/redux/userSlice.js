import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  firstName: "",
  image: "",
  lastName: "",
  _id: "",
  role: "",
  address:"",
  number:"",
  region:""
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRedux: (state, action) => {
      state._id = action.payload.data._id;
      state.firstName = action.payload.data.firstName;
      state.lastName = action.payload.data.lastName;
      state.email = action.payload.data.email;
      state.image = action.payload.data.image;
      state.role = action.payload.data.role;
      state.address = action.payload.data.address;
      state.number = action.payload.data.number;
      state.region = action.payload.data.region;
      localStorage.setItem("authState", JSON.stringify(action.payload.data));
    },
    logoutRedux: (state, action) => {
      state._id = "";
      state.firstName = "";
      state.lastName = "";
      state.email = "";
      state.image = "";
      state.role = "";
      state.address = "";
      state.number = "";
      state.region = "";
      localStorage.removeItem("authState");
    },
    updateUser: (state, action) => {
      state.number = action.payload.number;
      state.address = action.payload.address;
      state.region = action.payload.region;
      const authState = JSON.parse(localStorage.getItem('authState'));
  if (authState) {
    authState.number = action.payload.number;
    authState.address = action.payload.address;
    authState.region = action.payload.region;
    localStorage.setItem('authState', JSON.stringify(authState));
  }
    },
  },
});

export const checkAuthState = () => (dispatch) => {
  const authState = localStorage.getItem("authState");

  if (authState) {
    try {
      const user = JSON.parse(authState);
      dispatch(loginRedux({ data: user }));
    } catch (error) {
      console.error("Error parsing authState:", error);
      dispatch(logoutRedux());
    }
  } else {
    dispatch(logoutRedux());
  }
};

export const { loginRedux, logoutRedux, updateUser } = userSlice.actions;

export default userSlice.reducer;
