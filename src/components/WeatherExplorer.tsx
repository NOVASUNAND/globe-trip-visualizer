import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Waves, Mountain, Droplets, Fish, Palmtree, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import Globe3D from './Globe3D';
import ActivityCard from './ActivityCard';
import WeatherAnimation from './WeatherAnimation';

type Screen = 'globe' | 'activity' | 'date' | 'weather';
type Activity = 'surfing' | 'hiking' | 'swimming' | 'fishing' | 'vacation';
type Weather = 'sunny' | 'rainy' | 'windy' | 'hot' | 'cloudy';

const activities = [
  { id: 'surfing', icon: Waves, title: 'Surfing', description: 'Ride the waves' },
  { id: 'hiking', icon: Mountain, title: 'Hiking', description: 'Explore trails' },
  { id: 'swimming', icon: Droplets, title: 'Swimming', description: 'Take a dip' },
  { id: 'fishing', icon: Fish, title: 'Fishing', description: 'Catch of the day' },
  { id: 'vacation', icon: Palmtree, title: 'Vacation', description: 'Relax & unwind' },
];

const locations: Record<string, { lat: number; lng: number; weather: Weather }> = {
  'bahamas': { lat: 25.0343, lng: -77.3963, weather: 'sunny' },
  'hawaii': { lat: 19.8968, lng: -155.5828, weather: 'hot' },
  'iceland': { lat: 64.9631, lng: -19.0208, weather: 'windy' },
  'amazon': { lat: -3.4653, lng: -62.2159, weather: 'rainy' },
  'maldives': { lat: 3.2028, lng: 73.2207, weather: 'sunny' },
  'bali': { lat: -8.3405, lng: 115.0920, weather: 'hot' },
};

export default function WeatherExplorer() {
  const [screen, setScreen] = useState<Screen>('globe');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<{ name: string; coords: { lat: number; lng: number }; weather: Weather } | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showPin, setShowPin] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    const found = Object.entries(locations).find(([key]) => key === query);
    
    if (found) {
      const [name, coords] = found;
      setLocation({ name: name.charAt(0).toUpperCase() + name.slice(1), coords, weather: coords.weather });
      setShowPin(false);
      setAnimationComplete(false);
      
      setTimeout(() => {
        setShowPin(true);
      }, 1500);
    }
  };

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  const handleActivitySelect = (activityId: Activity) => {
    setSelectedActivity(activityId);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleBack = () => {
    if (screen === 'activity') {
      setScreen('globe');
      setLocation(null);
      setShowPin(false);
      setAnimationComplete(false);
    } else if (screen === 'date') {
      setScreen('activity');
      setSelectedActivity(null);
    } else if (screen === 'weather') {
      setScreen('date');
      setSelectedDate(undefined);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        {/* Globe Screen */}
        {screen === 'globe' && (
          <motion.div
            key="globe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col"
          >
            <div className="flex-1 relative">
              <Globe3D 
                targetLocation={location ? { ...location.coords, name: location.name } : undefined}
                onAnimationComplete={handleAnimationComplete}
                showPin={showPin}
              />
            </div>
            
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-10">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search location (e.g., Bahamas, Hawaii, Iceland)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg glass-card border-0 text-foreground placeholder:text-muted-foreground"
                  />
                </form>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  Try: Bahamas, Hawaii, Iceland, Amazon, Maldives, Bali
                </p>
              </motion.div>
            </div>

            {location && animationComplete && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
              >
                <Button
                  size="lg"
                  onClick={() => setScreen('activity')}
                  className="h-14 px-8 text-lg font-semibold gradient-cosmic border-0 shadow-2xl shadow-primary/50"
                >
                  Choose Activity
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Activity Screen */}
        {screen === 'activity' && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col p-8"
          >
            <Button
              variant="ghost"
              onClick={handleBack}
              className="self-start mb-6 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-2 gradient-text"
            >
              Choose Your Activity
            </motion.h1>
            <p className="text-muted-foreground mb-8">What would you like to do in {location?.name}?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {activities.map((activity, index) => (
                <ActivityCard
                  key={activity.id}
                  icon={activity.icon}
                  title={activity.title}
                  description={activity.description}
                  selected={selectedActivity === activity.id}
                  onClick={() => handleActivitySelect(activity.id as Activity)}
                  index={index}
                />
              ))}
            </div>

            {selectedActivity && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-auto flex justify-center"
              >
                <Button
                  size="lg"
                  onClick={() => setScreen('date')}
                  className="h-14 px-8 text-lg font-semibold gradient-aurora border-0 shadow-2xl shadow-accent/50"
                >
                  Select Date
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Date Screen */}
        {screen === 'date' && (
          <motion.div
            key="date"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8"
          >
            <Button
              variant="ghost"
              onClick={handleBack}
              className="self-start mb-6 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 rounded-3xl max-w-md w-full"
            >
              <h1 className="text-3xl font-bold mb-2 gradient-text text-center">
                Pick a Date
              </h1>
              <p className="text-muted-foreground mb-6 text-center">
                When do you want to {selectedActivity} in {location?.name}?
              </p>

              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                className="rounded-md border-0 pointer-events-auto"
              />

              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex justify-center"
                >
                  <Button
                    size="lg"
                    onClick={() => setScreen('weather')}
                    className="w-full h-14 text-lg font-semibold gradient-cosmic border-0 shadow-2xl shadow-primary/50"
                  >
                    View Weather
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Weather Screen */}
        {screen === 'weather' && location && selectedActivity && selectedDate && (
          <motion.div
            key="weather"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Button
              variant="ghost"
              onClick={handleBack}
              className="absolute top-8 left-8 z-20 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <WeatherAnimation
              weather={location.weather}
              location={location.name}
              date={selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              activity={activities.find(a => a.id === selectedActivity)?.title || ''}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
