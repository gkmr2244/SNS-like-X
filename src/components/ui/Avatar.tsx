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

// シンプルなイニシャル生成関数
const getInitials = (name: string): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// 固定の色クラス
const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500'
  ];
  
  // 名前のハッシュ値に基づいて色を選択
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
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