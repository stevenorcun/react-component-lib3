import React from 'react';

export function unhandle(event: React.SyntheticEvent) {
  event.stopPropagation();
}

export function preventDefault(event: React.SyntheticEvent) {
  event.preventDefault();
}

export function ignore(_) {}
