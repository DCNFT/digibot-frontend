import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

interface ModalState {
  onDismiss?: () => void;
}
interface ModalActions {
  setOnDismiss: (onDismiss: () => void) => void;
}

const initialState: ModalState = {};

export const useModalStore = create<ModalState & ModalActions>()(
  devtools(
    immer((set) => ({
      ...initialState,
      setOnDismiss(dismiss: () => void) {
        set((state) => {
          state.onDismiss = dismiss;
        });
      },
    })),
  ),
);
