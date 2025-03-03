import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Gamepad2 } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const CELL_SIZE = 18;
const INITIAL_SPEED = 150;
const SPEED_INCREASE = 5;

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPaused, setIsPaused] = useState(true);
  const [showGame, setShowGame] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [powerUp, setPowerUp] = useState<Position | null>(null);
  const [isPowered, setIsPowered] = useState(false);
  const gameLoopRef = useRef<number>();
  const { theme } = useTheme();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isPaused) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPaused]);

  const generateFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  const generatePowerUp = () => {
    if (Math.random() < 0.1 && !powerUp) { // 10% chance to spawn power-up
      let newPowerUp;
      do {
        newPowerUp = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE)
        };
      } while (
        snake.some(segment => segment.x === newPowerUp.x && segment.y === newPowerUp.y) ||
        (food.x === newPowerUp.x && food.y === newPowerUp.y)
      );
      setPowerUp(newPowerUp);
    }
  };

  const checkCollision = (head: Position) => {
    return (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      snake.some(segment => segment.x === head.x && segment.y === head.y)
    );
  };

  const gameLoop = () => {
    if (isPaused || isGameOver) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }

    if (checkCollision(head)) {
      setIsGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood());
      setScore(score + 1);
      generatePowerUp();
      setSpeed(prev => Math.max(prev - SPEED_INCREASE, 50));
    } else if (powerUp && head.x === powerUp.x && head.y === powerUp.y) {
      setPowerUp(null);
      setIsPowered(true);
      setTimeout(() => setIsPowered(false), 5000); // Power-up lasts 5 seconds
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
    gameLoopRef.current = setTimeout(gameLoop, speed);
  };

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setTimeout(gameLoop, speed);
    }
    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    };
  }, [snake, direction, food, isPaused, isGameOver]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(true);
    setPowerUp(null);
    setIsPowered(false);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="text-center">
      <motion.button
        onClick={() => setShowGame(!showGame)}
        className={`px-4 py-2 rounded-lg border border-[var(--primary)] text-[var(--primary)] text-sm flex items-center gap-2 mx-auto mb-4 ${
          theme === 'dark' ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a]' : 'bg-[#f5f5f5] hover:bg-[#e5e5e5]'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Gamepad2 size={16} />
        <span>Meanwhile, play Snake?</span>
      </motion.button>

      <AnimatePresence>
        {showGame && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className={`relative w-[${GRID_SIZE * CELL_SIZE}px] h-[${GRID_SIZE * CELL_SIZE}px] border-2 border-[var(--primary)] rounded-lg mx-auto overflow-hidden ${
                theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-[#f5f5f5]'
              } shadow-lg backdrop-blur-sm`}
            >
              {/* Grid background */}
              <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none">
                {[...Array(400)].map((_, i) => (
                  <div
                    key={i}
                    className={`border-[0.5px] ${
                      theme === 'dark' 
                        ? 'border-white/5' 
                        : 'border-black/5'
                    }`}
                  />
                ))}
              </div>

              {/* Snake */}
              {snake.map((segment, index) => (
                <motion.div
                  key={index}
                  className={`absolute rounded-sm ${
                    isPowered 
                      ? 'bg-gradient-to-r from-[var(--primary)] to-purple-500 shadow-lg'
                      : 'bg-[var(--primary)] shadow-md'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    width: CELL_SIZE - 2,
                    height: CELL_SIZE - 2,
                    left: segment.x * CELL_SIZE + 1,
                    top: segment.y * CELL_SIZE + 1,
                  }}
                />
              ))}

              {/* Food */}
              <motion.div
                className={`absolute rounded-full shadow-lg ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-red-500 to-pink-500'
                    : 'bg-gradient-to-br from-red-400 to-pink-400'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{
                  width: CELL_SIZE - 6,
                  height: CELL_SIZE - 6,
                  left: food.x * CELL_SIZE + 3,
                  top: food.y * CELL_SIZE + 3,
                }}
              />

              {/* Power-up */}
              {powerUp && (
                <motion.div
                  className={`absolute rounded-full shadow-lg ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                      : 'bg-gradient-to-br from-purple-400 to-blue-400'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    width: CELL_SIZE - 6,
                    height: CELL_SIZE - 6,
                    left: powerUp.x * CELL_SIZE + 3,
                    top: powerUp.y * CELL_SIZE + 3,
                  }}
                />
              )}

              {/* Game Over Overlay */}
              <AnimatePresence>
                {isGameOver && (
                  <motion.div
                    className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.h3 
                      className="text-xl font-bold text-white mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0.5, 1.2, 1] }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      Game Over!
                    </motion.h3>
                    <motion.div
                      className="mb-4 space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-[var(--primary)]">Score: {score}</p>
                      <p className="text-[var(--text-secondary)]">High Score: {Math.max(score, highScore)}</p>
                    </motion.div>
                    <motion.button
                      onClick={resetGame}
                      className={`px-4 py-2 bg-[var(--primary)] text-black rounded-lg shadow-lg ${
                        theme === 'dark' ? 'hover:bg-[var(--primary-light)]' : 'hover:bg-[var(--primary-dark)]'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Play Again
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Start Overlay */}
              <AnimatePresence>
                {isPaused && !isGameOver && (
                  <motion.div
                    className="absolute inset-0 bg-black/80 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.button
                      onClick={() => setIsPaused(false)}
                      className={`px-4 py-2 bg-[var(--primary)] text-black rounded-lg shadow-lg ${
                        theme === 'dark' ? 'hover:bg-[var(--primary-light)]' : 'hover:bg-[var(--primary-dark)]'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Start Game
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div 
              className="mt-4 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-sm text-[var(--text-secondary)]">
                Score: {score} | High Score: {highScore}
              </div>
              <div className="text-xs text-[var(--text-secondary)] opacity-75 space-y-1">
                <p>Use arrow keys or swipe to move</p>
                <p>Collect purple orbs for power-ups!</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SnakeGame;