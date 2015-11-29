import Reflux from 'reflux';

export default Reflux.createActions([
  'setUsername',
  'sendChatMessage',
  'receiveChatMessage',
  'enableLocalVideo',
  'setupLocalVideoStream',
  'userConnected',
  'userDisconnected',
  'callUser'
]);
