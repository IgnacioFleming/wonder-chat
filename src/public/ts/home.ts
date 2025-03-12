declare global {
  interface Window {
    io: any;
  }
}
const socket = window.io();
