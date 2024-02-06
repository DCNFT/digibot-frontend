'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import useToast from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
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
import { useState } from 'react';
import useDaouOfficeStore from '@/store/useDaouOfficeStore';

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
  const daouOfficeCookie = useDaouOfficeStore(
    (state) => state.daouOfficeCookie,
  );
  const setDaouOfficeCookie = useDaouOfficeStore(
    (state) => state.setDaouOfficeCookie,
  );
  const setProfile = useDaouOfficeStore((state) => state.setProfile);
  const profile = useDaouOfficeStore((state) => state.profile);
  const handleDaouOfficeCookie = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDaouOfficeCookie(e.target.value);
  };
  const { enqueueSuccessBar, enqueueErrorBar } = useToast();
  // 폼 정의 및 zodResolver로 검증 스키마 설정
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const [isLogin, setIsLogin] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

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
      setIsLogin(false);
      setIsRunning(false);
      const loginResponse = await fetch('/api/daou', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (!loginResponse.ok) {
        throw new Error('Login failed');
      }

      const loginData = await loginResponse.json();

      const responseProfile = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/chat/get_profile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loginData.cookie}`,
          },
        },
      );

      const profileData = await responseProfile.json();

      if (!profileData) {
        throw new Error('get profile failed');
      }

      console.log('profileData= ', profileData);
      setProfile(profileData);
      setDaouOfficeCookie(loginData.cookie);
      setIsLogin(true);
      setIsRunning(false);
      enqueueSuccessBar('로그인 성공');
      // 폼 제출 후 추가적인 액션(예: 성공 메시지 표시, 페이지 이동 등)
    } catch (error) {
      console.error('제출 중 오류 발생:', error);
      enqueueErrorBar('오류 발생');
      // 오류 처리(예: 오류 메시지 표시)
      setIsLogin(false);
      setIsRunning(false);
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

          <Button
            type="submit"
            disabled={isRunning}
            className={`flex-shrink-0 ${
              isRunning ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'
            } text-white py-2 px-4 rounded-md transition duration-300`}
          >
            {isRunning && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Send
          </Button>
        </form>
      </Form>
      <div className="flex flex-col w-full my-2">
        <p>Your cookie value</p>
        <Input value={daouOfficeCookie} onChange={handleDaouOfficeCookie} />
        {isLogin && (
          <>{profile.basic_info.name && <p>{profile.basic_info.name}</p>}</>
        )}
      </div>
    </div>
  );
};

export default Login;
