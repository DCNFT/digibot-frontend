export const runtime = 'edge';

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

  try {
    console.log('try');
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        username: username,
        password: password,
        captcha: '',
        returnUrl: '',
      }),
    });

    const res = await response.json();
    // 응답에서 쿠키 추출 (예시)
    console.log(res.headers.get('set-cookie'));
    return new Response(JSON.stringify({ data: res.data }), {
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
