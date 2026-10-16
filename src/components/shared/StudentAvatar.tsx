import React from 'react';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { initials } from '../../utils/grading';

interface StudentAvatarProps {
  name: string;
  size?: 'sm' | 'default' | 'lg';
}

export function StudentAvatar({ name, size = 'default' }: StudentAvatarProps) {
  return (
    <Avatar size={size}>
      <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">{initials(name)}</AvatarFallback>
    </Avatar>);

}