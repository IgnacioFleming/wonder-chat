const newMessageInput = document.getElementById("newMessage") as HTMLTextAreaElement;
const allContactsSection = document.getElementById("contacts") as HTMLElement;
const contactsList = document.getElementById("contacts-list") as HTMLDivElement;
const newMessageBtn = document.getElementById("new-message-btn") as HTMLElement;
const closeContactsBtn = document.getElementById("close-contacts") as HTMLElement;
const conversationsContainer = document.querySelector(".conversations") as HTMLDivElement;
const messagesSection = document.querySelector("section.messages") as HTMLElement;
const emojiBtn = document.getElementById("emoji-btn") as HTMLButtonElement;
const emojiPicker = document.getElementById("emoji-picker") as HTMLDivElement;
const searchConversations = document.getElementById("search-conversations") as HTMLDivElement;
const searchContacts = document.getElementById("search-contacts")?.querySelector("input") as HTMLInputElement;
const sendButton = document.querySelector(".sendButton") as HTMLButtonElement;
const filtersContainer = document.querySelector(".toggles-container") as HTMLDivElement;
const logoutBtn = document.getElementById("logout-btn") as HTMLDivElement;
const profileBtn = document.getElementById("profile-btn") as HTMLDivElement;
const filename = document.getElementById("filename-preview") as HTMLDivElement;
const avatarInput = document.getElementById("avatar-upload") as HTMLInputElement;
const profileContainer = document.querySelector(".profileContainer") as HTMLDivElement;
const backToChatsBtn = document.getElementById("back-to-chats") as HTMLButtonElement;
const sidebar = document.querySelector(".mainContainer .sidebar") as HTMLElement;
const burguerBtn = sidebar.querySelector(".burger-btn-container .burger-btn") as HTMLElement;

export default {
  newMessageInput,
  allContactsSection,
  contactsList,
  newMessageBtn,
  closeContactsBtn,
  conversationsContainer,
  messagesSection,
  emojiBtn,
  emojiPicker,
  searchConversations,
  searchContacts,
  sendButton,
  filtersContainer,
  logoutBtn,
  profileBtn,
  filename,
  avatarInput,
  profileContainer,
  backToChatsBtn,
  sidebar,
  burguerBtn,
};
