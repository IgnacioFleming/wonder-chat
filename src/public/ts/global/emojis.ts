import { emojis } from "../assets/emojis.ts";
import DOMElements from "./DOMElements.ts";

export const initializeEmojis = () => {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const clickedInsidePicker = DOMElements.emojiPicker.contains(target);
    const clickedInsideInput = DOMElements.newMessageInput.contains(target);
    const clickedEmojiBtn = DOMElements.emojiBtn.contains(target);
    if (!clickedEmojiBtn && !clickedInsideInput && !clickedInsidePicker) {
      DOMElements.emojiPicker.classList.add("scaleOut");
      setTimeout(() => {
        DOMElements.emojiPicker.classList.add("hidden");
        DOMElements.emojiPicker.classList.remove("scaleOut");
      }, 190);
    }
  });

  //fill emojis
  emojis.forEach((emoji) => {
    const span = document.createElement("span");
    span.textContent = emoji;
    span.classList.add("emoji-option", "pointer");
    span.addEventListener("click", () => {
      DOMElements.newMessageInput.value += emoji;
      DOMElements.newMessageInput.focus();
    });
    DOMElements.emojiPicker.appendChild(span);
  });
};
