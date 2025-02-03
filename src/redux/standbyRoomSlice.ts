import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type StandbyRoomState = {
    // 基本の型
    standbyRoom: boolean;
};

// 初期値を生成
const initialState: StandbyRoomState = {
    standbyRoom: false,
};

const standbyRoomSlice = createSlice({
    name: 'standbyRoom',
    initialState,
    reducers: {
        updateStandbyRoom: (state, action: PayloadAction<boolean>) => {
            state.standbyRoom = action.payload;
        },
    },
});

export const {
    updateStandbyRoom,
} = standbyRoomSlice.actions;
export default standbyRoomSlice.reducer;
