import { createSlice } from "@reduxjs/toolkit";

const controlSlice = createSlice({
    name: "control",
    initialState: {
        toolSelected: "mouse",
        menuClick: false,
        stageScale: 1,
        stagePosition: { x: 0, y: 0 }
    },
    reducers: {
        setToolSelected: (state, action) => {
            state.toolSelected = action.payload;
        },
        setMenuClick: (state, action) => {
            state.menuClick = action.payload;
        },

        setStageScale: (state, action) => {
            state.stageScale = action.payload;
        },
        
        setStagePosition: (state, action) => {
            state.stagePosition = action.payload;
        }   

    }
});

export const {setToolSelected, setMenuClick, setStageScale, setStagePosition} = controlSlice.actions;
export default controlSlice.reducer