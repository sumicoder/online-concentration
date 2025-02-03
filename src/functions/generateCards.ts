import CardType from '../types/Card.d';

const generateCards = () => {
    const CARD_COUNT = 13;

    const cards: CardType[] = [];

    for (let i = 0; i < CARD_COUNT; i++) {
        cards.push({
            id: i,
            number: i + 1, // カード番号
            color: 'red',
            isFlipped: false, // 初期状態で表向きかどうか
            pair: false,
        });
        cards.push({
            id: i + CARD_COUNT + 1,
            number: i + 1, // カード番号
            color: 'black', // 色を交互に
            isFlipped: false, // 初期状態で表向きかどうか
            pair: false,
        });
    }

    return {
        cards: cards
    };
};

export default generateCards;
