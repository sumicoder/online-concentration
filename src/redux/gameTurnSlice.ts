import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

type GameTurnState = {
    // 基本の型
    gameTurn: number;
};

// 初期値を生成
const initialState: GameTurnState = {
    gameTurn: 0,
};

const gameTurnSlice = createSlice({
    name: 'gameTurn',
    initialState,
    reducers: {
        updateGameTurn: (_, action: PayloadAction<{ update: boolean; roomId: string }>) => {
            if (action.payload.update) {
                updateDoc(doc(db, 'rooms', action.payload.roomId), {
                    turn: increment(1),
                });
            }
        },
        resetGameTurn: (state) => {
            state.gameTurn = 0;
        },
    },
});

export const { updateGameTurn, resetGameTurn } = gameTurnSlice.actions;
export default gameTurnSlice.reducer;
