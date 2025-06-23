// API 설정
const config = {
  // 개발 환경에서는 localhost, 배포 환경에서는 실제 백엔드 URL 사용
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  
  // API 엔드포인트들
  endpoints: {
    executeCode: '/execute-quantum-code',
    templates: '/quantum-templates',
    health: '/health'
  }
};

export default config; 