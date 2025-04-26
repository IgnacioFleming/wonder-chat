import { socket } from "../home.ts";
import { globalState } from "../store/store.ts";

export const sendInitialSocketEmits = () => {
  if (globalState?.user?._id) {
    socket.emit("register", globalState.user._id.toString());
    socket.emit("getConversations", { userId: globalState.user._id });
    socket.emit("markAllMessagesAsReceived", { userId: globalState.user._id });
  }
};
