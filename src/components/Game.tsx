import React, { useEffect, useState } from 'react';
// types
import RoomData from '../types/RoomData.d';
// firebase
import { auth, db } from '../lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { arrayUnion, collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
// components
import { Button, Input } from '@material-tailwind/react';
import Heading from './Heading';
import Standby from './Standby';
import Room from './Room';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { resetCards } from '../redux/CardSlice';
import { shuffleArray } from '../functions/shuffleArray';
// functions
import generateCards from '../functions/generateCards';
import { RootState } from '../redux/store';
import { updateStandbyRoom } from '../redux/standbyRoomSlice';

const Game: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [addRoom, setAddRoom] = useState<boolean>(false);
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [roomName, setRoomName] = useState<string>('');
    const [roomPassword, setRoomPassword] = useState<string>('');
    const [participationRoomId, setParticipationRoomId] = useState<string>('');
    // const [standbyRoom, setStandbyRoom] = useState<boolean>(false);
    const standbyRoom = useSelector((state: RootState) => state.standbyRoomReducer.standbyRoom);
    const dispatch = useDispatch();
    // const cards = generateCards().cards;
    const cards = shuffleArray(generateCards().cards);

    useEffect(() => {
        onSnapshot(collection(db, 'rooms'), (snapshot) => {
            const roomData: any = snapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
            setRooms(roomData);
        });
    }, []);

    // firestoreに保存
    const setRoom = (name: string) => {
        dispatch(resetCards(roomName));
        signInAnonymously(auth);
        let userData = {
            id: auth.currentUser!.uid,
            name: name,
            selectedCards: [],
        };
        setDoc(doc(db, 'rooms', roomName), {
            roomName: roomName,
            roomPassword: roomPassword,
            userData: [userData],
            cardData: JSON.stringify(cards),
            turn: 0,
            gameStatus: false,
        });
        setName('');
        setRoomPassword('');
        dispatch(updateStandbyRoom(true));
    };
    const handleParticipationButtonClick = (roomPassword: string, name: string, roomId: string) => {
        let userData = {
            id: auth.currentUser!.uid,
            name: name,
            selectedCards: [],
        };
        setRoomName(roomId);
        getDoc(doc(db, 'rooms', roomId)).then((snapshot) => {
            const roomData: any = snapshot.data();
            if (roomData.roomPassword === roomPassword) {
                updateDoc(doc(db, 'rooms', roomId), {
                    userData: arrayUnion(userData),
                });
                setName('');
                setRoomPassword('');
                setParticipationRoomId('');
                dispatch(updateStandbyRoom(true));
            } else {
                alert('パスワードが違います');
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto mt-12">
            <>
                {standbyRoom ? (
                    <>
                        <Button color="blue" onClick={() => dispatch(updateStandbyRoom(false))}>
                            戻る
                        </Button>
                        <Standby
                            // props
                            roomName={roomName}
                        />
                    </>
                ) : (
                    <>
                        <p>※ルームは4つまでです</p>
                        {rooms.length < 4 && addRoom ? (
                            <>
                                <Button color="blue" onClick={() => setAddRoom(!addRoom)}>
                                    戻る
                                </Button>
                                <Heading label="ルームを作成する" />
                                <Input value={roomName} onChange={(e) => setRoomName(e.target.value)} label="ルーム名を入力してください" />
                                <Input value={roomPassword} onChange={(e) => setRoomPassword(e.target.value)} label="パスワード" type="password" />
                                <Input value={name} onChange={(e) => setName(e.target.value)} label="プレイヤー名" />
                                <Button color="blue" onClick={() => setRoom(name)}>
                                    ルームを作成する
                                </Button>
                            </>
                        ) : (
                            <>
                                {rooms.length < 4 && (
                                    <Button color="blue" onClick={() => setAddRoom(!addRoom)}>
                                        ルームを作成する
                                    </Button>
                                )}
                                {participationRoomId ? (
                                    <>
                                        <Input value={name} onChange={(e) => setName(e.target.value)} label="プレイヤー名" />
                                        <Input value={roomPassword} onChange={(e) => setRoomPassword(e.target.value)} label="パスワード" type="password" />
                                        <Button color="blue" onClick={() => handleParticipationButtonClick(roomPassword, name, participationRoomId)}>
                                            ゲームに参加する
                                        </Button>
                                        <div className="">
                                            <Button color="blue" onClick={() => setParticipationRoomId('')}>
                                                戻る
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Heading label="ルーム情報" />
                                        <ol className="grid gap-4">
                                            {rooms.map((room: RoomData) => (
                                                <Room room={room} onClick={() => setParticipationRoomId(room.roomName)} key={room.id} />
                                            ))}
                                        </ol>
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </>
        </div>
    );
};

export default Game;
