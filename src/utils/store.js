import { configureStore } from "@reduxjs/toolkit";
import controlSlice from "./controlSlice"
import drawSlice from "./drawSlice"

export const store = configureStore({
    reducer: {
        control: controlSlice,
        draw: drawSlice
    }
})