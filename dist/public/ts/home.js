const socket = window.io();
socket.on("sendMessages", (messages) => console.log(messages));
export {};
