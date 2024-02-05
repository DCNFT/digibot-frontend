'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import useChatStoreLab from '@/store/useChatStoreLab';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// 폼 스키마에 패스워드 필드 추가
const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

const Login = () => {
  const daouOfficeCookie = useChatStoreLab((state) => state.daouOfficeCookie);
  const setDaouOfficeCookie = useChatStoreLab(
    (state) => state.setDaouOfficeCookie,
  );

  const handleDaouOfficeCookie = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDaouOfficeCookie(e.target.value);
  };

  // 폼 정의 및 zodResolver로 검증 스키마 설정
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // 제출 핸들러 정의
  const onSubmit = async (
    values: z.infer<typeof formSchema>,
    event?: React.BaseSyntheticEvent,
  ) => {
    console.log('onSubmit = ', onSubmit);
    if (event) {
      event.preventDefault(); // 페이지 새로고침 방지
    }

    console.log(values); // 검증된 폼 값 사용
    try {
      //   const response = await api.post('http://localhost:3000/api/daou', values);
      //   console.log(response);
      const response = await fetch('/api/daou', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login success:', data.cookie);
      setDaouOfficeCookie(data.cookie);
      // 폼 제출 후 추가적인 액션(예: 성공 메시지 표시, 페이지 이동 등)
    } catch (error) {
      console.error('제출 중 오류 발생:', error);
      // 오류 처리(예: 오류 메시지 표시)
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                {error && <FormMessage>{error.message}</FormMessage>}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                {error && <FormMessage>{error.message}</FormMessage>}
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div className="flex flex-col w-full my-2">
        <p>Your cookie value</p>
        <Input
          value={daouOfficeCookie}
          onChange={handleDaouOfficeCookie}
        ></Input>
      </div>
    </div>
  );
};

export default Login;
