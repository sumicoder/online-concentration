import UserType from './User.d';

type RoomData = {
    id: string;
	roomName: string;
	roomPassword: string;
    userData: UserType[];
    cardData: string;
    turn: number;
	gameStatus: boolean;
};

export default RoomData;
