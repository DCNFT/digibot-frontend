import { Variants } from "framer-motion";

export const appearAnimation = "animate-fadeIn";
export const disappearAnimation = "animate-fadeOut";

export const animationHandler = (element: HTMLElement | null) => {
  if (!element) return;
  element.classList.toggle(
    "animate-fadeIn",
    !element.classList.contains("animate-fadeIn")
  );
  element.classList.toggle(
    "animate-fadeOut",
    !element.classList.contains("animate-fadeOut")
  );
};

export const animationVariants: Variants = {
  initial: { x: "0px" },
  animate: { x: "0px" },
  exit: { x: "0px" },
};

export const animationMap = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const promotedGradient = "animate-gradient";
