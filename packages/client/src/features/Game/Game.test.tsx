import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { ConfigProvider } from 'antd'
import type React from 'react'
import { Provider } from 'react-redux'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import Game from './Game'

// Создаем мок-хранилище Redux
const createTestStore = () =>
  configureStore({
    reducer: {
      user: (state = { data: null }) => state,
      game: (state = { score: 0 }) => state,
    },
  })

// мокаем навигацию
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

// мокаем GameCanvas, чтобы изолировать тестирование родительского контейнера Game
vi.mock('./components/GameCanvas/GameCanvas', () => ({
  default: () => (
    <canvas data-testid="mock-game-canvas" aria-label="Игровое поле игры" />
  ),
}))

describe('Интеграционные тесты родительского компонента Game', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    vi.clearAllMocks()
    store = createTestStore()
  })

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <ConfigProvider prefixCls="test-ant">{ui}</ConfigProvider>
      </Provider>
    )
  }

  test('должен соответствовать сохраненному HTML-снапшоту структуры компонента', () => {
    const { asFragment } = renderWithProviders(<Game />)
    expect(asFragment()).toMatchSnapshot()
  })

  test('должен успешно монтировать и рендерить дочерний компонент GameCanvas внутри себя', () => {
    renderWithProviders(<Game />)

    // Проверяем, что дочерний холст успешно отрендерился внутри разметки
    const canvasElement = screen.getByTestId('mock-game-canvas')
    expect(canvasElement).toBeInTheDocument()
    expect(screen.getByLabelText('Игровое поле игры')).toBeInTheDocument()
  })
})
