import { Helmet } from 'react-helmet-async'
import styles from './forum-page.module.css'
import { Navigation } from './Navigation/Navigation'

export const ForumPage = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Форум</title>
        <meta name="description" content="Форум" />
      </Helmet>

      <main className={styles.page}>
        <Navigation topics={Topics}></Navigation>
      </main>
    </>
  )
}

export async function forumSectionsLoader() {
  console.log('get all forum sections')
  return Topics
}

export async function forumThemesLoader({
  params,
}: {
  params: { sectionId: string }
}) {
  console.log('get themes for section', params.sectionId)
  return ThemesMock
}

export async function themeMessagesLoader({
  params,
}: {
  params: { themeId: string }
}) {
  console.log('get messages for theme', params.themeId)
}

export const Topics = [
  {
    id: '123',
    title: 'Важные',
    lastMessage: 'njhkjhk.khk',
    themes: 12,
    messages: 324,
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
