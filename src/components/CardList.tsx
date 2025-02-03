import React, { useEffect, useMemo, useState } from 'react';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { setCardFlipped, setCardTurnOver, judgePair, cardDataUpdate, initCards } from '../redux/CardSlice';
// firebase
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
// Three.js
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import Card from '../three/Card';
import Table from '../three/Table';
// redux
import { RootState } from '../redux/store';
import { updateGameTurn } from '../redux/gameTurnSlice';
import { updateGameFinished } from '../redux/gameFinishedSlice';
import { updateStandbyRoom } from '../redux/standbyRoomSlice';
// functions
import generateCards from '../functions/generateCards';
import { getCircularElement } from '../functions/getCircularElement';
import { shuffleArray } from '../functions/shuffleArray';
// types
import UserType from '../types/User.d';
import CardType from '../types/Card.d';
import RoomData from '../types/RoomData.d';
// components
import Heading from './Heading';
import { Button } from '@material-tailwind/react';

type Props = {
    roomId: string;
};

const CardList: React.FC<Props> = ({ roomId }) => {
    const [room, setRoom] = useState<RoomData>({
        id: '',
        roomName: '',
        roomPassword: '',
        userData: [],
        cardData: '',
        turn: 0,
        gameStatus: false,
    });
    const [DBcards, setDBcards] = useState<string>('[]');
    const [gameStatus, setGameStatus] = useState<Boolean>(false);
    const [participatingUsers, setParticipatingUsers] = useState<UserType[]>([]);
    const [currnetUser, setCurrnetUser] = useState<string>('');
    const [DBUser, setDBUser] = useState<UserType>({ id: '', name: '', selectedCards: [] });
    const [DBUserData, setDBUserData] = useState<UserType[]>([]);
    const [gameTurn, setGameTurn] = useState<number>(0);
    const gameFinished = useSelector((state: RootState) => state.gameFinishedReducer.gameFinished);
    const dispatch = useDispatch();
    useEffect(() => {
        onSnapshot(doc(db, 'rooms', roomId), (snapshot) => {
            const roomData: any = snapshot.data();
            if (!roomData.cardData) return;
            setRoom(roomData);
            setGameStatus(roomData.gameStatus);
            setDBcards(roomData.cardData);
            setParticipatingUsers(roomData.userData);
            setGameTurn(roomData.turn);
            setDBUserData(roomData.userData);
            setDBUser(roomData.userData.find((u: UserType) => u.id === auth.currentUser!.uid));
        });
    }, []);

    const [wait, setWait] = useState(false);
    const cards = JSON.parse(DBcards);
    dispatch(initCards(cards));

    const [firstCard, setFirstCard] = useState<CardType>();
    const [secondCard, setSecondCard] = useState<CardType>();

    const handleCardClick = (card: CardType) => {
        if (
            currnetUser !== DBUser.name ||
            wait || // 連打防止
            cards.find((c: CardType) => c.id === card.id)!.isFlipped || // 反転しているカード
            cards.find((c: CardType) => c.id === card.id)!.pair // ペアになっているカード
        ) {
            return;
        }
        setWait(true);
        dispatch(setCardFlipped(card.id));
        dispatch(cardDataUpdate(roomId));
        if (firstCard === undefined) {
            setFirstCard(card);
            setWait(false);
        } else {
            setSecondCard(card);
        }
    };

    useEffect(() => {
        if (firstCard && secondCard) {
            setTimeout(() => {
                if (firstCard.number === secondCard.number) {
                    dispatch(judgePair(firstCard.id));
                    dispatch(judgePair(secondCard.id));
                    dispatch(updateGameTurn({ update: false, roomId: roomId }));
                    DBUserData.find((u: UserType) => u.id === getCircularElement(participatingUsers, gameTurn).id)!.selectedCards.push(firstCard);
                    DBUserData.find((u: UserType) => u.id === getCircularElement(participatingUsers, gameTurn).id)!.selectedCards.push(secondCard);
                } else {
                    dispatch(setCardTurnOver(firstCard.id));
                    dispatch(setCardTurnOver(secondCard.id));
                    dispatch(updateGameTurn({ update: true, roomId: roomId }));
                }
                setFirstCard(undefined);
                setSecondCard(undefined);
                setWait(false);
                dispatch(cardDataUpdate(roomId));
                updateDoc(doc(db, 'rooms', roomId), {
                    userData: DBUserData,
                });
            }, 1500);
        }
    }, [secondCard]);

    useEffect(() => {
        if (participatingUsers.length === 0) return;
        setCurrnetUser(getCircularElement(participatingUsers, gameTurn).name);
    }, [gameTurn, gameStatus]);

    useEffect(() => {
        if (cards.every((card: CardType) => card.pair)) {
            dispatch(updateGameFinished(true));
        } else {
            dispatch(updateGameFinished(false));
        }
    }, [cards]);

    const Rig = () => {
        const { camera } = useThree();
        return useFrame(() => {
            camera.lookAt(0, 0, 0);
        });
    };

    const memoizedCards = useMemo(() => {
        return cards.map((card: CardType, index: number) => (
            <Card
                key={card.id} // パフォーマンス最適化のためkeyを追加することをお勧めします
                isFlipped={card.isFlipped}
                onClick={() => handleCardClick(card)}
                position={[(index % 5) - 2, Math.floor(index / 5) * -1, -0.04]}
                color={card.color}
                text={card.number}
            />
        ));
    }, [cards]);

    const handleGameResetButtonClick = () => {
        updateDoc(doc(db, 'rooms', roomId), {
            roomName: roomId,
            roomPassword: room.roomPassword,
            userData: [],
            cardData: JSON.stringify(shuffleArray(generateCards().cards)),
            turn: 0,
            gameStatus: false,
        });
        dispatch(updateGameFinished(false));
        setCurrnetUser('');
        setDBUser({ id: '', name: '', selectedCards: [] });
        setDBUserData([]);
        dispatch(updateStandbyRoom(false));
    };

    return (
        <>
            {gameFinished ? (
                <>
                    <Heading label="ゲームリザルト" />
                    <p>ルームの名前：{roomId}</p>
                    {participatingUsers && (
                        <>
                            <Heading label="参加者" />
                            <div className="">
                                {participatingUsers.map((user: any) => (
                                    <div key={user.id}>
                                        <p>{user.name}</p>
                                        <div className="w-full h-80">
                                            <Canvas key={user.id} shadows>
                                                <PerspectiveCamera near={1} far={100} position={[0, 0, 8]} makeDefault />
                                                <directionalLight position={[0, 0, 2]} />
                                                <pointLight castShadow decay={-0.2} position={[-3, 2, 8]} />
                                                {user.selectedCards.map((card: any, index: number) => (
                                                    <Card
                                                        // props
                                                        key={card.id}
                                                        isFlipped={true}
                                                        position={[(index % 6) - 3, Math.floor(index / 6) * -1 + 0.5, -0.04]}
                                                        color={card.color}
                                                        text={card.number}
                                                    />
                                                ))}
                                                <Rig />
                                            </Canvas>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid items-center px-4">
                                <Button color="green" onClick={handleGameResetButtonClick} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} >
                                    トップに戻る
                                </Button>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    <div className="grid pb-24 h-screen">
                        <p className="text-md">現在のターン数：{gameTurn + 1}</p>
                        <p className="text-md">現在のプレイヤー：{currnetUser}</p>
                        <p className="text-md">あなたの名前：{DBUser.name}</p>
                        <div className="w-full">
                            <Canvas shadows>
                                <PerspectiveCamera near={1} far={100} position={[0, -10, 10]} makeDefault />
                                <directionalLight position={[-2, -2, 2]} />
                                <pointLight castShadow decay={-0.2} position={[-3, 2, 8]} />
                                {memoizedCards}
                                <Table />
                                <Rig />
                            </Canvas>
                        </div>
                        {currnetUser !== DBUser.name && (
                            <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-30 grid place-items-center items-end">
                                <span className=" bg-white px-4 py-2">{currnetUser}が操作してます</span>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default CardList;
