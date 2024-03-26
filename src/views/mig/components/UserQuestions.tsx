import { ChatData, Messages } from '@/types';

type UserQuestionsProps = {
  chatMessagesList: ChatData[];
};

const UserQuestions = ({ chatMessagesList }: UserQuestionsProps) => {
  console.log('chatMessagesList= ', chatMessagesList);
  const userQuestionList = chatMessagesList
    .flatMap((chatData) =>
      chatData.chatMessages.filter(
        (chatMessage) => chatMessage.message.role === 'user',
      ),
    )
    .reduce((acc, current) => {
      // `acc` 배열에서 현재 `current.message.content`와 동일한 `content`를 가진 메시지가 있는지 확인
      const isDuplicate = acc.some(
        (msg) => msg.content === current.message.content,
      );

      // 동일한 `content`를 가진 메시지가 없다면 현재 메시지를 `acc` 배열에 추가
      if (!isDuplicate) {
        acc.push(current.message);
      }

      return acc;
    }, [] as Messages[]);

  const scrollToItem = (id: string) => {
    const items = document.querySelectorAll(`[data-id="${id}"]`);
    let currentIndex = 0;

    const scrollNext = () => {
      if (currentIndex < items.length) {
        items[currentIndex].scrollIntoView({ block: 'start' });
        currentIndex++;
        requestAnimationFrame(scrollNext);
      }
    };

    scrollNext();
  };

  return (
    <div className="flex flex-col">
      {userQuestionList.map((question) => {
        return (
          <div
            key={question?.id}
            onClick={() => scrollToItem(question?.user_input_sequence_id ?? '')}
          >
            {question?.content}
          </div>
        );
      })}
    </div>
  );
};
export default UserQuestions;
