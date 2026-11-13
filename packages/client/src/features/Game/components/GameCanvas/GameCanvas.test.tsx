import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as loaderUtils from '../../utils/loader'
import * as playerUtils from '../../utils/player'
import GameCanvas from './GameCanvas'

const createTestStore = () =>
  configureStore({
    reducer: {
      game: (state = { score: 0 }) => state,
    },
  })

describe('Интеграционные тесты игровой сцены (GameCanvas + useGameCanvas)', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Мокаем Canvas для тестовой среды jsdom
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      drawImage: vi.fn(),
      imageSmoothingEnabled: true,
    } as unknown as CanvasRenderingContext2D)

    // Мокаем загрузчик спрайтов, чтобы игровой цикл запустился сразу
    vi.spyOn(loaderUtils, 'loadGameImages').mockResolvedValue({} as never)
  })

  test('должен корректно рендерить элемент canvas с атрибутами размеров и доступности', () => {
    render(
      <Provider store={createTestStore()}>
        <GameCanvas />
      </Provider>
    )

    const canvas = screen.getByLabelText('Игровое поле игры')
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute('tabindex', '0')
    expect(canvas).toHaveAttribute('width')
    expect(canvas).toHaveAttribute('height')
  })

  test('должен фокусировать холст и менять координаты X персонажа при нажатии клавиши движения', async () => {
    const user = userEvent.setup()
    // Шпионим за updatePlayer, чтобы отследить координаты героя
    const updatePlayerSpy = vi.spyOn(playerUtils, 'updatePlayer')

    render(
      <Provider store={createTestStore()}>
        <GameCanvas />
      </Provider>
    )

    // Ждём завершения асинхронной загрузки спрайтов
    await waitFor(() => {
      expect(loaderUtils.loadGameImages).toHaveBeenCalledTimes(1)
    })

    // Кликаем по холсту, чтобы поставить фокус
    const canvas = screen.getByLabelText('Игровое поле игры')
    await user.click(canvas)
    expect(canvas).toHaveFocus()

    // Ждём первого тика игрового цикла и фиксируем стартовую координату X
    await waitFor(() => {
      expect(updatePlayerSpy).toHaveBeenCalled()
    })
    const initialX = updatePlayerSpy.mock.calls[0][0].player.x

    // Зажимаем клавишу движения вправо (или KeyD)
    await user.keyboard('{ArrowRight>}')

    // Ждём следующих кадров анимации и проверяем, что координата X увеличилась
    await waitFor(() => {
      const lastCallIndex = updatePlayerSpy.mock.calls.length - 1
      const currentX = updatePlayerSpy.mock.calls[lastCallIndex][0].player.x
      expect(currentX).toBeGreaterThan(initialX)
    })

    // Отпускаем клавишу
    await user.keyboard('{/ArrowRight}')
  })
})
