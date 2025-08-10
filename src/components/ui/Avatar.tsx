import { getInitials, getAvatarColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg'
};

export function Avatar({ 
  src, 
  alt = '', 
  fallback, 
  size = 'md', 
  className,
  onClick 
}: AvatarProps) {
  const displayName = fallback || alt;
  const initials = getInitials(displayName);
  const colorClass = getAvatarColor(displayName);
  const isClickable = !!onClick;

  return (
    <div
      className={cn(
        'relative rounded-full flex items-center justify-center font-bold text-white overflow-hidden',
        sizeClasses[size],
        colorClass,
        isClickable && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            // 画像読み込みエラー時にフォールバックを表示
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <span className={cn(
        'flex items-center justify-center w-full h-full',
        src ? 'hidden' : ''
      )}>
        {initials}
      </span>
    </div>
  );
} 