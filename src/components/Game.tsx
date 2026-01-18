import React, { useEffect, useState } from 'react';

const Game: React.FC = () => {
    const [score, setScore] = useState(0);
    const [bullets, setBullets] = useState<number[]>([]);
    const [targets, setTargets] = useState<{ id: number; position: number }[]>([]);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!gameOver) {
                setTargets(prevTargets => [
                    ...prevTargets,
                    { id: Math.random(), position: Math.random() * 100 },
                ]);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [gameOver]);

    const shoot = (id: number) => {
        setBullets([...bullets, id]);
        setTargets(prevTargets => prevTargets.filter(target => target.id !== id));
        setScore(score + 1);
    };

    const handleGameOver = () => {
        setGameOver(true);
        alert(`Game Over! Final Score: ${score}`);
    };

    return (
        <div>
            <h1>Shooter Game</h1>
            <div>
                Score: {score}
                {gameOver && <button onClick={() => window.location.reload()}>Restart</button>} 
            </div>
            <div style={{ position: 'relative', height: '400px', border: '1px solid black' }}>
                {targets.map(target => (
                    <div
                        key={target.id}
                        onClick={() => shoot(target.id)}
                        style={{
                            position: 'absolute',
                            left: `${target.position}%`,
                            top: Math.random() * 100 + '%',
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'red',
                            cursor: 'pointer',
                        }}
                    />
                ))}
            </div>
            <button onClick={handleGameOver}>End Game</button>
        </div>
    );
};

export default Game;