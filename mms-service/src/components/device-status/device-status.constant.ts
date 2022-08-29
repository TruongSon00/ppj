export enum DEVICE_STATUS_ENUM {
  ACTIVE = 1, // Đang hoạt động
  STOP = 2, // Dừng
  ERROR = 3, // Lỗi
  OFF = 4, // Tắt
  MAINTENANCE = 5, // Tắt bảo trì
  IN_USE = 6, //Đang sử dụng
}

export const ACTION_NAME = 'deviceStatus.createNewActivity';
