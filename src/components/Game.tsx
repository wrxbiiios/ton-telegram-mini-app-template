import React, { useState, useEffect } from 'react';

const Game: React.FC = () => {
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);

    const startGame = () => {
        setScore(0);
        setIsGameOver(false);
        // Start game logic here (e.g., timer, game loop)
    };

    const endGame = () => {
        setIsGameOver(true);
        // Logic to handle ending the game (e.g., save scores)
    };

    const updateScore = (points: number) => {
        setScore(prevScore => prevScore + points);
    };

    useEffect(() => {
        // Example game loop
        if (!isGameOver) {
            const interval = setInterval(() => {
                // Game logic to update state
                // Can also check for game over conditions here
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isGameOver]);

    return (
        <div>
            <h1>Simple Game</h1>
            <h2>Score: {score}</h2>
            {isGameOver ? (
                <div>
                    <h3>Game Over!</h3>
                    <button onClick={startGame}>Restart Game</button>
                </div>
            ) : (
                <div>
                    <button onClick={() => updateScore(10)}>Increase Score</button>
                    {/* Render more game UI here */}
                </div>
            )}
        </div>
    );
};

export default Game;