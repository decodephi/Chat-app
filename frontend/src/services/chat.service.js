import api from "./api";

export const userService = {
  getAll:   ()       => api.get("/users"),
  search:   (query)  => api.get(`/users/search?q=${encodeURIComponent(query)}`),
  getById:  (id)     => api.get(`/users/${id}`),
};

export const messageService = {
  getConversation: (userId)      => api.get(`/messages/${userId}`),
  send:            (receiverId, message) =>
    api.post(`/messages/send/${receiverId}`, { message }),
  deleteMessage:   (messageId)   => api.delete(`/messages/${messageId}`),
};
