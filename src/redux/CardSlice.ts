import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import CardType from '../types/Card.d';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

type CardsState = {
    // 基本の型
    cards: CardType[];
};

// 初期値を生成
const initialState: CardsState = {
    cards: [],
};

const cardsSlice = createSlice({
    name: 'cardList',
    initialState,
    reducers: {
        initCards: (state, action: PayloadAction<CardType[]>) => {
            state.cards = action.payload;
        },
        resetCards: (state, roomId: PayloadAction<string>) => {
            state.cards = [];
            setDoc(
                doc(db, 'rooms', roomId.payload),
                {
                    cardData: JSON.stringify([]),
                },
                { merge: true }
            );
        },
        setCardFlipped: (state, id: PayloadAction<number>) => {
            const card = state.cards.find((c) => c.id === id.payload);
            if (card) {
                card.isFlipped = !card.isFlipped; // isFlipped の状態をトグル
            }
        },
        setCardTurnOver: (state, id: PayloadAction<number>) => {
            const card = state.cards.find((c) => c.id === id.payload);
            if (card) {
                card.isFlipped = false;
            }
        },
        judgePair: (state, number: PayloadAction<number>) => {
            const card = state.cards.find((c) => c.id === number.payload);
            if (card) {
                card.pair = true;
            }
        },
        cardDataUpdate: (state, roomId: PayloadAction<string>) => {
            setDoc(
                doc(db, 'rooms', roomId.payload),
                {
                    cardData: JSON.stringify(state.cards),
                },
                { merge: true }
            );
        },
    },
});

export const { setCardFlipped, setCardTurnOver, judgePair, cardDataUpdate, initCards, resetCards } = cardsSlice.actions;
export default cardsSlice.reducer;
