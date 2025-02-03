import React, { useEffect, useState } from 'react';
// firebase
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
// types
import RoomData from '../types/RoomData.d';
// components
import { Button } from '@material-tailwind/react';
import Heading from './Heading';
import CardList from './CardList';

type Props = {
    roomName: string;
};

const Standby: React.FC<Props> = ({ roomName }) => {
    const [user] = useAuthState(auth);
    const [room, setRoom] = useState<RoomData>({
        id: '',
        roomName: '',
        roomPassword: '',
        userData: [],
        cardData: '',
        turn: 0,
        gameStatus: false,
    });
    useEffect(() => {
        onSnapshot(doc(db, 'rooms', roomName), (snapshot) => {
            const roomData: any = snapshot.data();
            setRoom(roomData);
        });
    }, []);

    const handleStartButtonClick = () => {
        updateDoc(doc(db, 'rooms', roomName), {
            gameStatus: true,
        });
    };

    return (
        <>
            {room.gameStatus ? (
                <CardList roomId={roomName} />
            ) : (
                <>
                    <Heading label="待機中" />
                    <p>ルームの名前：{roomName}</p>
                    {room.userData && (
                        <>
                            <Heading label="参加者" />
                            <div className="">
                                {room.userData.map((user: any) => (
                                    <div key={user.id}>
                                        {user.name}
                                        <br />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {room.userData.length > 1 && user?.uid === room.userData[0].id && (
                        <>
                            <Button onClick={handleStartButtonClick} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >ゲームスタート</Button>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default Standby;
