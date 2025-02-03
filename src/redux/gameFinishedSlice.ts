import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type GameFinishedState = {
    // 基本の型
    gameFinished: boolean;
};

// 初期値を生成
const initialState: GameFinishedState = {
    gameFinished: false,
};

const gameFinishedSlice = createSlice({
    name: 'gameFinished',
    initialState,
    reducers: {
        updateGameFinished: (state, action: PayloadAction<boolean>) => {
            state.gameFinished = action.payload;
        },
    },
});

export const { updateGameFinished } = gameFinishedSlice.actions;
export default gameFinishedSlice.reducer;
