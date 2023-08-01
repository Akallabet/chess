import { createContext } from 'react';

export type ModalContextType = { open: boolean; onClose: () => void };

export const ModalContext = createContext<ModalContextType>({
  open: false,
  onClose: () => {},
});
