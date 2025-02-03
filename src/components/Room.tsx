import React from 'react';
import RoomData from '../types/RoomData.d';

type Props = {
    room: RoomData;
	onClick: () => void;
};

const Room: React.FC<Props> = ({ room, onClick }) => {
    return (
        <li key={room.id} onClick={onClick} className="cursor-pointer hover:bg-gray-200">
            <div className="p-4 border border-gray-700 rounded">
                <p>ルーム名：{room.roomName}</p>
                {room.userData && (
                    <div className="grid grid-cols-[auto_1fr] gap-4">
                        <p>参加者：</p>
                        <div className="">
                            {room.userData.map((user: any) => (
                                <div key={user.id}>
                                    {user.name}
                                    <br />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </li>
    );
};

export default Room;
