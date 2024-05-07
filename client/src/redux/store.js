import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import regSlice from "./regSlice.js";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        reg: regSlice
    }
})