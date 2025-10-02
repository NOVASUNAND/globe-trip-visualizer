import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ActivityCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
  index: number;
}

export default function ActivityCard({ 
  icon: Icon, 
  title, 
  description, 
  selected, 
  onClick,
  index 
}: ActivityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative cursor-pointer p-6 rounded-2xl glass-card
        transition-all duration-300
        ${selected ? 'ring-2 ring-accent shadow-lg shadow-accent/50' : 'hover:shadow-xl'}
      `}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div className={`
          p-4 rounded-full 
          ${selected ? 'bg-accent text-accent-foreground' : 'bg-primary/20 text-primary'}
          transition-all duration-300
        `}>
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      {selected && (
        <motion.div
          layoutId="selected-indicator"
          className="absolute inset-0 rounded-2xl border-2 border-accent"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.div>
  );
}
