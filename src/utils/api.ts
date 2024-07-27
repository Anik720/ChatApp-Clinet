export const BASE_URL = "http://localhost:8080/api/v1";
export const SOCKET_URL = "http://localhost:8080";

export const API = {
  auth: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    CHECK_NICKNAME: "/auth/check-nick-name",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    GUEST_REGISTER: "/auth/guest-register",
    LOGOUT: "/auth/logout",
  },
  room: {
    GET_ROOMS: "/room",
    CREATE_GROUP_ROOM: "/room/group",
  },
  user: {
    GET_USER_IF_ROOM_EXITS: "/user/room-exits",
  },
  conversation: {
    CONVERSATION_ROUTE: "/conversation",
  },

  admin: {
    user: {
      GET_USERS: "/admin/users",
      GET_ALL_USERS: "/admin/users/all",
      BANNED_USER: "/admin/user/banned-user",
      UNBANNED_USER: "/admin/user/unbanned-user",
      GET_ROOM_BY_USER_ID: "/admin/user/room",
      GET_CONVERSATION_BY_ROOM_ID: "/admin/user/conversation",
    },
    ip: {
      IPs: "/admin/ip",
    },
    filter: {
      FILTERS: "/admin/filter",
    },
    conversation: {
      GET_ALL_CONVERSATIONS: "/admin/conversation/get-all-conversations",
      GET_CONVERSATION_BY_FILTER:
        "/admin/conversation/get-all-conversations-by-filter",
      DELETE_CONVERSATION: "/admin/conversation/delete-conversation",
    },
    device: {
      DEVICE_URL: "/admin/device",
    },
  },
};
