import type { RequestSubConfigMap, RequestToken } from '../types';

const planingURL = '';
const kakaoURL = '-';
const planingToken = '-';
const kakaoToken = '-';

const TEST_URL = 'api.example.com';

export const requestHeaderMap: RequestSubConfigMap = {
  [planingURL]: { Authorization: `Bearer ${planingToken}` },
  [kakaoURL]: { Authorization: `KakaoAK ${kakaoToken}` },
  // 💡 추후 Cookie값을 직접 조작하지 않는 방법으로 리팩토링 예정
  [TEST_URL]: (token: RequestToken) => ({
    Authorization: `Bearer ${token?.accessToken}`,
    Cookie: `refresh_token=${token?.refreshToken}`,
  }),
};
