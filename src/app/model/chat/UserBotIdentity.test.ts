import { expect, it } from 'vitest';
import { ChatSender } from './ChatSender';
import { ChatAdapter } from '../network/chat/ChatAdapter';
it('keeps existing bot mapping and separates owned bots with identical profiles', () => {
  const adapter = new ChatAdapter();
  const base = { hash:'m',icon:'',nickname:'same',level:100,isMobile:false,msg:{response:'hello'},reactions:[],replies:[],type:'chat',timestamp:'' };
  expect(adapter.toChat(base as any).sender.type).toBe('BOT');
  const a=adapter.toChat({...base,level:0,senderKind:'user-bot',senderId:'a',owner:{hash:'owner-a',nickname:'Owner A',icon:''}} as any).sender;
  const b=adapter.toChat({...base,level:0,senderKind:'user-bot',senderId:'b',owner:{hash:'owner-a',nickname:'Owner A',icon:''}} as any).sender;
  expect(a.type).toBe('USER_BOT');
  expect(ChatSender.equals(a,b)).toBe(false);
  expect(ChatSender.equals(a,new ChatSender('','same','PC'))).toBe(false);
});
