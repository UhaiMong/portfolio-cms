import { useState } from "react";

export const useMediaPicker = () => {
  const [open, setOpen] = useState(false);
  return {
    open,
    openPicker: () => setOpen(true),
    closePicker: () => setOpen(false),
  };
};
