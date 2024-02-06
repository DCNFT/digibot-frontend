import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Login from '@/views/lab/components/Login';

export function DialogCloseButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">GET COOKIE</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Daou Office 로그인</DialogTitle>
          <DialogDescription>
            아이디와 비밀번호를 저장하지 않습니다.
            <p>서버를 통한 bypass 방식으로 로그인합니다.</p>
            <p>쿠키값은 절대 남들에게 공유하지 마세요</p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Login />
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
