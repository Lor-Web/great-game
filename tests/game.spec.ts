import { expect, type Page, test } from '@playwright/test'

test.describe('Страница игры и игровой движок (HAR E2E)', () => {
  test.beforeEach(async ({ page }) => {
    //Заходим на главную страницу
    await page.goto('/')

    //заполняем форму
    await page.getByPlaceholder('Введите ваш логин').fill('nameinchat1')
    await page.getByPlaceholder('Ваш пароль').fill('svabbsabsaA1')

    // Проверяем прошёл ли вход успешно
    const responsePromise = page.waitForResponse(
      response =>
        response.url().includes('signin') &&
        response.request().method() === 'POST'
    )

    await page.getByRole('button', { name: 'Войти в аккаунт' }).click()

    const response = await responsePromise
    expect(response.ok()).toBeTruthy()

    // Ждём, пока приложение обработает вход
    await expect(page).not.toHaveURL('/')

    // Переходим на страницу игры
    await page.goto('/game')
  })

  test('должен отображать игровой холст', async ({ page }) => {
    await expect(page).toHaveURL(/\/game/)

    const canvas = page.getByLabel('Игровое поле игры')
    await expect(canvas).toBeVisible()
    await expect(canvas).toHaveAttribute('tabindex', '0')
  })

  test('должен скрывать стартовый оверлей и реагировать на клавиши управления', async ({
    page,
  }) => {
    const canvas = page.getByLabel('Игровое поле игры')
    await expect(canvas).toBeVisible()

    const startButton = page.locator('main button').first()
    if (await startButton.isVisible()) {
      await startButton.click()
      await expect(startButton).toBeHidden()
    }

    await canvas.click()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('Space')

    await expect(canvas).toBeVisible()
  })
})
