import { ElMessage } from 'element-plus';

const messageQueue = [];
let isShowing = false;

const showNextMessage = () => {
  if (messageQueue.length === 0) {
    isShowing = false;
    return;
  }

  isShowing = true;
  const { type, message, options } = messageQueue.shift();

  ElMessage({
    type,
    message,
    duration: options.duration || 3000,
    ...options,
    onClose: () => {
      showNextMessage();
    }
  });
};

export const messageManager = {
  success(message, options = {}) {
    messageQueue.push({ type: 'success', message, options });
    if (!isShowing) {
      showNextMessage();
    }
  },
  error(message, options = {}) {
    messageQueue.push({ type: 'error', message, options });
    if (!isShowing) {
      showNextMessage();
    }
  },
  warning(message, options = {}) {
    messageQueue.push({ type: 'warning', message, options });
    if (!isShowing) {
      showNextMessage();
    }
  },
  info(message, options = {}) {
    messageQueue.push({ type: 'info', message, options });
    if (!isShowing) {
      showNextMessage();
    }
  }
};
