import { useState, useEffect } from 'react';

const useGameLogic = () => {
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        // Example logic for leveling up
        if (score >= 10) {
            setLevel(level + 1);
            setScore(0); // Reset score after leveling up
        }
        // Example game over condition
        if (score < 0) {
            setIsGameOver(true);
        }
    }, [score, level]);

    const increaseScore = () => setScore(score + 1);
    const decreaseScore = () => setScore(score - 1);
    const resetGame = () => {
        setScore(0);
        setLevel(1);
        setIsGameOver(false);
    };

    return { score, level, isGameOver, increaseScore, decreaseScore, resetGame };
};

export default useGameLogic;