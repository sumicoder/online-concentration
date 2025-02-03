import { useLoader } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { DoubleSide, TextureLoader, LinearFilter } from 'three';
import { useSpring, animated } from '@react-spring/three';
import { Text } from '@react-three/drei';

type Props = {
    isFlipped: boolean;
    position: [x: number, y: number, z: number];
    onClick?: () => void;
    color: string;
    text: number;
};

const Card: React.FC<Props> = (props) => {
    const [hovered, setHover] = useState(false);
    const [clicked, setClicked] = useState(false);
    const texture = useLoader(TextureLoader, './card-background.png');
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.generateMipmaps = false;

    const { position: animatedPosition, rotation: animatedRotation } = useSpring<any>({
        position: props.isFlipped ? (clicked ? [props.position[0], props.position[1], props.position[2] + 0.2] : [props.position[0], props.position[1], props.position[2]]) : hovered ? [props.position[0], props.position[1], props.position[2] + 0.1] : props.position,
        rotation: [0, props.isFlipped ? -Math.PI : 0, 0], // 回転アニメーション
        config: { tension: 800, friction: 100 },
    });

    const handlePointerUp = () => {
        // if (!props.isFlipped) {
        setClicked(true);
        // }
    };

    useEffect(() => {
        setTimeout(() => {
            setClicked(false);
        }, 700);
    }, [props.isFlipped]);

    return (
        <animated.mesh
            // props
            position={animatedPosition}
            rotation={animatedRotation}
            onClick={props.onClick}
            onPointerUp={handlePointerUp}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            castShadow
            receiveShadow
        >
            <boxGeometry args={[0.56, 0.88, 0.02]} />
            <meshStandardMaterial color={'black'} side={DoubleSide} attach={'material-0'} />
            <meshStandardMaterial color={'black'} side={DoubleSide} attach={'material-1'} />
            <meshStandardMaterial color={'black'} side={DoubleSide} attach={'material-2'} />
            <meshStandardMaterial color={'black'} side={DoubleSide} attach={'material-3'} />
            <meshStandardMaterial map={texture} side={DoubleSide} attach={'material-4'} />
            <meshStandardMaterial color={props.color} side={DoubleSide} attach={'material-5'} />
            <Text
                position={[0, 0, -0.02]} // Slightly in front of the mesh
                rotation={[0, Math.PI, 0]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
                onClick={props.onClick}
            >
                {props.text.toString()}
            </Text>
        </animated.mesh>
    );
};

export default Card;
