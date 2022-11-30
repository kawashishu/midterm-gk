import { GroupModel } from "@app/domain/GroupModel";
import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    groups: {
        myGroups: [] as GroupModel[],
        joinGroups: [] as GroupModel[]
    },
    isLoaded: false
}

export const groupSlice = createSlice({
    name: "Groups",
    initialState,
    reducers: {
        setGroups: (state, action) => {
            return {
                groups: action.payload,
                isLoaded :true
            }
        }
    }
})

export const { setGroups } = groupSlice.actions;

export default groupSlice.reducer;