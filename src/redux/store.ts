import { configureStore } from '@reduxjs/toolkit';
import cardsReducer from './CardSlice';
import gameTurnReducer from './gameTurnSlice';
import gameFinishedReducer from './gameFinishedSlice';
import standbyRoomReducer from './standbyRoomSlice';

export const store = configureStore({
    reducer: {
        cardsReducer: cardsReducer, // カードスライスを登録
        gameTurnReducer: gameTurnReducer, // ゲームのターン
        gameFinishedReducer: gameFinishedReducer, // ゲームの終了
        standbyRoomReducer: standbyRoomReducer, // 待機状態
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
