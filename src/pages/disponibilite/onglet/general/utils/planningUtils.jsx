// src/utils/planningUtils.js
export const getDurationInMinutes = (type) => {
    switch (type) {
      case 'naturopathie':
        return 120;
      case 'acupuncture':
        return 30;
      case 'hypnose':
        return 90;
      default:
        return 0;
    }
  };
  
  export const getColorByType = (type) => {
    switch (type) {
      case 'naturopathie':
        return '#FF6B6B';
      case 'acupuncture':
        return '#4ECDC4';
      case 'hypnose':
        return '#45B7D1';
      default:
        return '#CCCCCC';
    }
  };
  