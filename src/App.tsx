import './output.css';
// firebase
import { auth } from './lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
// components
import Game from './components/Game';
import { Button } from '@material-tailwind/react';

function App() {
    const [user, loading] = useAuthState(auth);

    const handleButtonClick = () => {
        signInAnonymously(auth);
    };
    return (
        <>
            <h1 className="text-center text-4xl bold mt-4">神経衰弱</h1>
            {user ? (
                <>
                    <Game />
                </>
            ) : (
                <div className="mx-auto w-fit mt-8">
                    <Button onClick={handleButtonClick} color="green">
                        ゲームを開始する
                    </Button>
                </div>
            )}
        </>
    );
}

export default App;
