/**
 * RTL（从右到左）布局支持包装器
 */
'use client';

import { ReactNode, useEffect } from 'react';

interface DirectionWrapperProps {
  children: ReactNode;
  direction: 'ltr' | 'rtl';
}

export default function DirectionWrapper({ children, direction }: DirectionWrapperProps) {
  // 更新CSS变量和样式
  useEffect(() => {
    if (direction === 'rtl') {
      document.documentElement.style.direction = 'rtl';
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.style.direction = 'ltr';
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }
  }, [direction]);
  
  return (
    <div dir={direction} className="min-h-screen">
      {children}
    </div>
  );
}