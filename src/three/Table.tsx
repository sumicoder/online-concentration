import React from 'react';

const Table: React.FC = () => {
    return (
        <mesh castShadow receiveShadow position={[0, -2.5, -0.2]}>
            <boxGeometry args={[10, 7, 0.3]} />
            <meshStandardMaterial color={0x00763a} />
        </mesh>
    );
};

export default Table;
