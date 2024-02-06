export async function POST(request: Request) {
  const json = await request.json();
  const { username, password } = json as {
    username: string;
    password: string;
  };

  const url = 'https://digicaps.daouoffice.com/api/login';
  const data = {
    username: username,
    password: password,
    captcha: '',
    returnUrl: '',
  };

  const headers = {
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Content-Length': '70',
    'Content-Type': 'application/json',
    Host: 'digicaps.daouoffice.com',
    Origin: 'https://digicaps.daouoffice.com',
    Pragma: 'no-cache',
    Referer: 'https://digicaps.daouoffice.com/login',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    'sec-ch-ua':
      '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
  };

  // 쿠키를 분리하기 위한 함수 정의
  function parseCookies(headerValue: string) {
    const cookies: { [key: string]: string } = {}; // Add index signature to allow indexing with a string parameter
    const cookiePairs = headerValue.split(', ');

    cookiePairs.forEach((cookie) => {
      // ';'로 쿠키 이름과 값 분리
      const parts = cookie.split(';')[0]; // 첫 번째 부분만 사용 (Path, Expires 등은 무시)
      const [name, value] = parts.split('=');
      cookies[name] = value;
    });

    return cookies;
  }

  try {
    console.log('try');
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(data),
    });
    // 예시로 주어진 HeadersList 객체에서 'set-cookie' 헤더 값을 추출
    const setCookieHeader = response.headers.get('set-cookie');
    // 쿠키 파싱
    const cookies = parseCookies(setCookieHeader as string);
    // 'GOSSOcookie' 값 추출
    const gossoCookieValue = cookies['GOSSOcookie'];
    //console.log('gossoCookieValue = ', gossoCookieValue);
    return new Response(JSON.stringify({ cookie: gossoCookieValue }), {
      status: 200,
    });
  } catch (error: any) {
    const errorMessage = error.error?.message || 'An unexpected error occurred';
    const errorCode = error.status || 500;
    console.log('error !!!!! ', error);
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
    });
  }
}
