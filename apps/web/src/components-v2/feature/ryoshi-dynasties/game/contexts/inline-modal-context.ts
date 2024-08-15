import {createContext, Dispatch, RefObject, SetStateAction} from "react";

export interface InlineModalContextProps {
  ref: RefObject<HTMLDivElement> | null;
  setRef: Dispatch<SetStateAction<RefObject<HTMLDivElement> | null>>
}

export const InlineModalContext = createContext<InlineModalContextProps | null>(null);