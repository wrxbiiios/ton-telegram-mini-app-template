import React from 'react';
import { useNavigate } from 'react-router-dom';

const Game: React.FC = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        // Redirect to the new game page
        navigate('/game');
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="text-cyan-400 text-2xl font-bold animate-pulse">
                Loading Cyber Skull Shooter...
            </div>
        </div>
    );
};

export default Game;