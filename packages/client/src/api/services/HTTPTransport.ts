import { BASE_URL } from '../config'

export enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

//обзначаем типы которые мы можем безопасно сериализовать в query
type QueryPrimitive = string | number | boolean
type QueryParamValue = QueryPrimitive | QueryPrimitive[]
export type QueryData = Record<string, QueryParamValue>

type RequestOptions = {
  headers?: Record<string, string>
  method?: METHODS
  data?: QueryData | Record<string, unknown> | FormData | string | null
  timeout?: number
  responseType?: XMLHttpRequestResponseType
  withCredentials?: boolean
  validate?: (data: unknown) => boolean
  //Добавляем AbortSignal
  signal?: AbortSignal
}

// Единый тип для http-методов,
type HTTPMethod = <R = unknown>(
  url: string,
  options?: Omit<RequestOptions, 'method'>
) => Promise<R>

function appendQueryParameters(urlObj: URL, data: QueryData): void {
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }

    if (Array.isArray(value)) {
      // Поддержка массивов
      value.forEach(item => {
        urlObj.searchParams.append(key, String(item))
      })
    } else if (typeof value === 'object') {
      // Защита от вложенных объектов
      throw new Error(
        `Deeply nested objects are not supported in query string for key: ${key}`
      )
    } else {
      urlObj.searchParams.append(key, String(value))
    }
  })
}

export class HTTPTransport {
  private readonly baseURL: string
  private readonly defaultTimeout = 5000

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL
  }

  public get: HTTPMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.GET }, options.timeout)

  public post: HTTPMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.POST }, options.timeout)

  public put: HTTPMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.PUT }, options.timeout)

  public delete: HTTPMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.DELETE }, options.timeout)

  private request<T = unknown>(
    url: string,
    options: RequestOptions,
    timeout: number = this.defaultTimeout
  ): Promise<T> {
    const {
      headers = {},
      method,
      data,
      responseType,
      withCredentials = true,
      validate,
      signal,
    } = options

    if (!method) {
      return Promise.reject(new Error('HTTP method is required'))
    }

    // Формируем адрес через нативный класс URL
    const parsedURL = new URL(url, this.baseURL)
    const isGet = method === METHODS.GET

    // Если это GET-запрос и переданы параметры, безопасно добавляем их в URL
    if (
      isGet &&
      data &&
      typeof data === 'object' &&
      !(data instanceof FormData)
    ) {
      try {
        appendQueryParameters(parsedURL, data as QueryData)
      } catch (error) {
        return Promise.reject(error)
      }
    }

    return new Promise<T>((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // finalUrl теперь всегда валиден, даже если в url изначально были свои `?param=1`
      xhr.open(method, parsedURL.toString())

      // отслеживаем сигнал, если он отменён прерываемся
      if (signal?.aborted) {
        return reject({ reason: 'Request aborted', request: xhr })
      }

      // Слушаем событие отмены из хука
      if (signal) {
        signal.addEventListener('abort', () => {
          xhr.abort() // отменяем сетевой запрос в браузере!
        })
      }

      xhr.withCredentials = withCredentials

      if (responseType) {
        xhr.responseType = responseType
      }

      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key])
      })

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          let response: unknown

          if (responseType) {
            response = xhr.response
          } else {
            const contentType = xhr.getResponseHeader('Content-Type') || ''
            if (contentType.includes('application/json')) {
              try {
                response = JSON.parse(xhr.responseText)
              } catch (parseError) {
                // Если сервер задекларировал JSON, но прислал битый текст выдаём ошибку
                reject({
                  status: xhr.status,
                  reason: 'Deserialization Error: Invalid JSON response',
                  error: parseError,
                  responseText: xhr.responseText,
                  request: xhr,
                })
                return
              }
            } else {
              response = xhr.responseText
            }
          }

          // проверка структуры переданным валидатором
          if (validate && !validate(response)) {
            reject({
              status: xhr.status,
              reason: 'Validation Error: Response schema mismatch',
              response,
              request: xhr,
            })
            return
          }

          resolve(response as T)
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
            response: xhr.responseText,
            request: xhr,
          })
        }
      }

      xhr.onabort = () => reject({ reason: 'Request aborted', request: xhr })
      xhr.onerror = () => reject({ reason: 'Network error', request: xhr })
      xhr.ontimeout = () =>
        reject({ reason: 'Request timeout', timeout, request: xhr })

      xhr.timeout = timeout

      if (isGet || !data) {
        xhr.send()
      } else if (data instanceof FormData) {
        xhr.send(data)
      } else if (typeof data === 'object') {
        const hasContentType = Object.keys(headers).some(
          key => key.toLowerCase() === 'content-type'
        )
        if (!hasContentType) {
          xhr.setRequestHeader('Content-Type', 'application/json')
        }
        xhr.send(JSON.stringify(data))
      } else {
        xhr.send(String(data))
      }
    })
  }
}

export default HTTPTransport
