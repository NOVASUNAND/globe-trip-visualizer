import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, Wind, Flame } from 'lucide-react';

interface WeatherAnimationProps {
  weather: 'sunny' | 'rainy' | 'windy' | 'hot' | 'cloudy';
  location: string;
  date: string;
  activity: string;
}

export default function WeatherAnimation({ weather, location, date, activity }: WeatherAnimationProps) {
  const renderWeatherScene = () => {
    switch (weather) {
      case 'sunny':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute"
            >
              <Sun className="w-48 h-48 text-yellow-400 drop-shadow-2xl" />
            </motion.div>
            
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-20 bg-gradient-to-b from-yellow-300/50 to-transparent"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                  rotate: `${i * 30}deg`,
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        );
      
      case 'rainy':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-8 bg-gradient-to-b from-blue-400 to-transparent"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20}%`,
                }}
                animate={{
                  y: ['0vh', '120vh'],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear",
                }}
              />
            ))}
            <motion.div
              animate={{ x: [-20, 20, -20] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <CloudRain className="w-48 h-48 text-slate-400" />
            </motion.div>
          </div>
        );
      
      case 'windy':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 bg-gradient-to-r from-transparent via-slate-300/50 to-transparent"
                style={{
                  width: `${100 + Math.random() * 200}px`,
                  top: `${Math.random() * 100}%`,
                  left: '-200px',
                }}
                animate={{
                  x: ['0vw', '120vw'],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "linear",
                }}
              />
            ))}
            <motion.div
              animate={{
                x: [-30, 30, -30],
                rotate: [-5, 5, -5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Wind className="w-48 h-48 text-slate-400" />
            </motion.div>
          </div>
        );
      
      case 'hot':
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Flame className="w-48 h-48 text-orange-500" />
            </motion.div>
            
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-16 h-16 rounded-full bg-gradient-radial from-orange-400/30 to-transparent blur-xl"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        );
      
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              animate={{ x: [-40, 40, -40] }}
              transition={{ duration: 10, repeat: Infinity }}
            >
              <Cloud className="w-48 h-48 text-slate-300" />
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative">
        {renderWeatherScene()}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="glass-card p-8 mx-4 mb-8 rounded-3xl"
      >
        <h2 className="text-3xl font-bold mb-2 gradient-text">{location}</h2>
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <span>{date}</span>
          <span>•</span>
          <span>{activity}</span>
        </div>
        <p className="text-lg text-foreground">
          {weather === 'sunny' && '☀️ Perfect sunny day with clear skies'}
          {weather === 'rainy' && '🌧️ Expect rainfall throughout the day'}
          {weather === 'windy' && '💨 Strong winds, breezy conditions'}
          {weather === 'hot' && '🔥 Hot weather, stay hydrated!'}
          {weather === 'cloudy' && '☁️ Cloudy with mild temperatures'}
        </p>
      </motion.div>
    </div>
  );
}
