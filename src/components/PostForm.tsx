"use client";

import { useState, useCallback } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface PostFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  userAvatar?: string | null;
  userName?: string;
}

export function PostForm({ 
  onSubmit, 
  placeholder = "今何をしていますか？",
  buttonText = "投稿",
  className,
  userAvatar,
  userName = "ユーザー"
}: PostFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxLength = 280;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(content.trim());
      setContent('');
      setCharCount(0);
    } catch (error) {
      console.error('投稿エラー:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [content, isSubmitting, onSubmit]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    setCharCount(value.length);
  }, []);

  const isOverLimit = charCount > maxLength;
  const canSubmit = content.trim().length > 0 && !isOverLimit && !isSubmitting;

  return (
    <form onSubmit={handleSubmit} className={cn(
      'border-b border-gray-200 p-4',
      className
    )}>
      <div className="flex space-x-3">
        <Avatar
          src={userAvatar}
          alt={userName}
          fallback={userName}
          size="md"
          className="flex-shrink-0"
        />
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={cn(
              'w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base',
              isOverLimit && 'border-red-500 focus:ring-red-500'
            )}
            rows={3}
            maxLength={maxLength}
          />
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-1 16h12l-1-16" />
                </svg>
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={cn(
                'text-sm',
                isOverLimit ? 'text-red-500' : 'text-gray-500'
              )}>
                {charCount}/{maxLength}
              </span>
              
              <Button
                type="submit"
                disabled={!canSubmit}
                loading={isSubmitting}
                size="sm"
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
} 