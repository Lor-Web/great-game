import type { TopicRecord } from './hooks'

export const Topics: TopicRecord[] = [
  {
    id: '123',
    title: 'Важные',
    lastMessage: 'njhkjhk.khk',
    themes: 12,
    messages: 324,
  },
  {
    id: '125',
    title: 'Еще важнее',
    lastMessage: 'ку ку!',
    themes: 14,
    messages: 384,
  },
  {
    id: '123',
    title: 'Неважные',
    lastMessage: 'Тут что-то написано',
    themes: 124,
    messages: 3334,
  },
]

export const MessageMock = {
  content: 'Это текст сообщения',
  time: '01.02.2026',
  author: {
    avatar: 'https://github.com/mdo.png',
    name: 'Famokus Pocus',
  },
}

export const ThemesMock = [
  {
    id: '1',
    title: 'Тема 1',
    author: 'Василий Петрович',
    lastMessage: 'Я хочу предложить полет на Луну',
    answers: 2,
  },
  {
    id: '2',
    title: 'Тема 2',
    author: 'Марья Моревна',
    lastMessage: 'А я в подземелье сижу',
    answers: 45,
  },
]

export const MessagesMock = [
  {
    id: '74y5h5',
    content:
      'Наследование проходит как public, но помимо этого существует статическая функция возвращающая указатель на класс созданный по шаблону проектирования интерфейса. Лично мне это кажется странным, зачем создавать класс A внутри интерфейса. Полиморфизм через интерфейс может достигаться за счёт приведения типов, смысла плодить лишние методы нет.К тому же это нарушает чистую абстракцию которой по идее должен следовать класс созданный по шаблону проектирования интерфейса.Простейший случай использования, который вероятно нужно усовершенствовать:',
    time: '06:00 01.01.2029',
    author: {
      avatar: 'https://github.com/mdo.png',
      name: 'atomicxp',
    },
  },
  {
    id: 'kfjjkvj44',
    content:
      'Как известно для проектирования ООП систем разумно использовать шаблоны проектирования. Существует ряд правил, одно из которых было описано в',
    time: '07:00 01.01.2029',
    author: {
      avatar: 'https://github.com/mdo.png',
      name: 'atomicxp',
    },
  },
]
