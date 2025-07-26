import request from '@/utils/request';

// 上传头像
export const uploadAvatar = (formData) => {
  return request.post('/user/upload-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 更新个人信息
export const updateUserInfo = (data) => {
  return request.post('/user/update-info', data);
};