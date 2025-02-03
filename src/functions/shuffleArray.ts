import CardType from "../types/Card";

export const shuffleArray = (array: CardType[]): CardType[] => {
	const cloneArray: CardType[] = [...array]; // 配列のクローンを作成

	for (let idx = cloneArray.length - 1; idx > 0; idx--) {
		const rand = Math.floor(Math.random() * (idx + 1)); // ランダムなインデックスを生成
		[cloneArray[idx], cloneArray[rand]] = [cloneArray[rand], cloneArray[idx]]; // 要素をスワップ
	}

	return cloneArray; // シャッフルされた配列を返す
};