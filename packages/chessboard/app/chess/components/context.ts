import { createContext } from 'react';
import type { GameOutput } from '../hooks/use-game';

export const Context = createContext({} as GameOutput);
