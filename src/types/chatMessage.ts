import { Messages } from '@/types';

export interface ChatMessage {
  message: Messages;
  fileItems: string[];
  id?: string;
}

//  type Messages = {
//   assistant_id: string | null;
//   chat_id: string;
//   content: string;
//   created_at: string;
//   id: string;
//   image_paths: string[];
//   model: string;
//   role: string;
//   sequence_number: number;
//   updated_at: string | null;
//   user_id: string;
// };

// type ChatData = {
//   chatMessages: ChatMessage[];
//   chatId: string;
//   chatSettings: ChatSettings;
//   id: string;
//   isDisplay: boolean;
// };

// const chatDataArray : ChatData[]

// ---실 데이터
// [
//   {
//       "chatMessages": [
//           {
//               "message": {
//                   "chat_id": "",
//                   "content": "hi",
//                   "created_at": "",
//                   "id": "beb60f04-c7b2-40c3-9c91-383312bf1335",
//                   "image_paths": [],
//                   "model": "gpt-3.5-turbo",
//                   "role": "user",
//                   "sequence_number": 0,
//                   "updated_at": "",
//                   "user_id": "",
//                   "assistant_id": null
//               },
//               "fileItems": []
//           },
//           {
//               "message": {
//                   "chat_id": "",
//                   "content": "Hello! How can I assist you today?",
//                   "created_at": "",
//                   "id": "3ebb4846-3cf6-4282-bac9-91642d7ac6c6",
//                   "image_paths": [],
//                   "model": "gpt-3.5-turbo",
//                   "role": "assistant",
//                   "sequence_number": 1,
//                   "updated_at": "",
//                   "user_id": "",
//                   "assistant_id": null
//               },
//               "fileItems": []
//           },
//           {
//               "message": {
//                   "chat_id": "",
//                   "content": "너 이름은 뭐니?",
//                   "created_at": "",
//                   "id": "171a4c2a-ee5b-4872-9020-3afb74b840f2",
//                   "image_paths": [],
//                   "model": "gpt-3.5-turbo",
//                   "role": "user",
//                   "sequence_number": 2,
//                   "updated_at": "",
//                   "user_id": "",
//                   "assistant_id": null
//               },
//               "fileItems": []
//           },
//           {
//               "message": {
//                   "chat_id": "",
//                   "content": "저는 AI 어시스턴트입니다. 도와드릴 일이 있나요?",
//                   "created_at": "",
//                   "id": "f181f2c6-68a4-4689-8e2a-d859439126ec",
//                   "image_paths": [],
//                   "model": "gpt-3.5-turbo",
//                   "role": "assistant",
//                   "sequence_number": 3,
//                   "updated_at": "",
//                   "user_id": "",
//                   "assistant_id": null
//               },
//               "fileItems": []
//           }
//       ],
//       "chatId": "",
//       "chatSettings": {
//           "model": "gpt-3.5-turbo",
//           "prompt": "You are a friendly, helpful AI assistant.",
//           "temperature": 0.5,
//           "contextLength": 4096,
//           "includeProfileContext": true,
//           "includeWorkspaceInstructions": true,
//           "embeddingsProvider": "openai"
//       },
//       "id": "1",
//       "isDisplay": true
//   },
//   {
//       "chatMessages": [
//           {
//               "message": {
//                   "chat_id": "",
//                   "content": "hi",
//                   "created_at": "",
//                   "id": "91c55a8c-1577-44ae-a3e7-1f24faf4884e",
//                   "image_paths": [],
//                   "model": "gpt-4",
//                   "role": "user",
//                   "sequence_number": 0,
//                   "updated_at": "",
//                   "user_id": "",
//                   "assistant_id": null
//               },
//               "fileItems": []
//           },
//           {
//               "message": {
//                   "chat_id": "",
//                   "content": "Hello! How can I assist you today?",
//                   "created_at": "",
//                   "id": "c7855cb1-b3df-4664-993a-723f4a572121",
//                   "image_paths": [],
//                   "model": "gpt-4",
//                   "role": "assistant",
//                   "sequence_number": 1,
//                   "updated_at": "",
//                   "user_id": "",
//                   "assistant_id": null
//               },
//               "fileItems": []
//           },
//           {
//               "message": {
//                   "chat_id": "",
//                   "content": "너 이름은 뭐니?",
//                   "created_at": "",
//                   "id": "4197fe20-f559-4a63-a4cf-f4cbb40d7644",
//                   "image_paths": [],
//                   "model": "gpt-4",
//                   "role": "user",
//                   "sequence_number": 2,
//                   "updated_at": "",
//                   "user_id": "",
//                   "assistant_id": null
//               },
//               "fileItems": []
//           },
//           {
//               "message": {
//                   "chat_id": "",
//                   "content": "제 이름은 OpenAI입니다. 어떻게 도와드릴까요?",
//                   "created_at": "",
//                   "id": "36d1fcad-d9ed-4964-bd77-44dfbb4444cd",
//                   "image_paths": [],
//                   "model": "gpt-4",
//                   "role": "assistant",
//                   "sequence_number": 3,
//                   "updated_at": "",
//                   "user_id": "",
//                   "assistant_id": null
//               },
//               "fileItems": []
//           }
//       ],
//       "chatId": "",
//       "chatSettings": {
//           "model": "gpt-4",
//           "prompt": "You are a friendly, helpful AI assistant.",
//           "temperature": 0.5,
//           "contextLength": 4096,
//           "includeProfileContext": true,
//           "includeWorkspaceInstructions": true,
//           "embeddingsProvider": "openai"
//       },
//       "id": "2",
//       "isDisplay": true
//   }
// ]

// ---
// 나는 chatDataArray 가 있어
// 여기에는 현재 두개의 채팅 데이터가 있어
// 그리고 각각 user와 assistant가 말한 채팅 내역이 존재해
// user의 질문은 동일하지만 assistant는 각각 대답이 달라
// 그래서 나는 user의 질문은 한개만 보여주고
// assistant 대답들은 전부다 보여주고 싶은거야

// ex)
// 유저 질문 : 안녕?
// 봇 대답 : 1번봇: 안녕하세요 2번봇: 안녕하세요 반갑습니다
// 유저 질문 : 너 이름은 뭐니?
// 봇 대답 : 1번봇: 제 이름은 1번봇입니다 2번봇: 제 이름은 2번봇입니다
