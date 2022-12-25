const URL = 'https://innercircle-server.vercel.app';
const registerApi = `${URL}/api/user/register`;
const loginApi = `${URL}/api/user/login`;
const avatarApi = `https://api.multiavatar.com/4645646`;
const userAvatar = `${URL}/api/user/setAvatar`;
const getUsersApi = `${URL}/api/user/users`;
const sendMessgaeApi = `${URL}/api/msgs/send`;
const getMsgsApi = `${URL}/api/msgs/receive`;

export {
  URL,
  registerApi,
  loginApi,
  avatarApi,
  userAvatar,
  getUsersApi,
  sendMessgaeApi,
  getMsgsApi,
};
