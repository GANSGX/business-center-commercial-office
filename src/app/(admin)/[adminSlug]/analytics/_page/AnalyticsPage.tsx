'use client'

import { useState } from 'react'
import styles from './AnalyticsPage.module.css'

// Яндекс.Метрика API существует!
// Reporting API: https://api-metrika.yandex.net/stat/v1/data
// Требуется: OAuth-токен + ID счётчика
// После подключения этот раздел будет показывать реальные данные

const SETUP_STEPS = [
  {
    num: '01',
    title: 'Создайте счётчик',
    desc: 'Зайдите на metrika.yandex.ru → «Добавить счётчик». Укажите домен сайта.',
  },
  {
    num: '02',
    title: 'Код уже встроен',
    desc: 'Скрипт Яндекс.Метрики уже добавлен в проект (подключается через переменную NEXT_PUBLIC_METRIKA_ID в .env).',
  },
  {
    num: '03',
    title: 'Включите публичную статистику',
    desc: 'В настройках счётчика → «Доступ» → включите «Публичный доступ к статистике».',
  },
  {
    num: '04',
    title: 'Вставьте ID счётчика',
    desc: 'Скопируйте ID счётчика (8-значное число) и вставьте в поле ниже.',
  },
]

const API_CAPABILITIES = [
  { icon: '👥', title: 'Посетители', desc: 'Уникальные пользователи, новые vs вернувшиеся' },
  { icon: '📈', title: 'Трафик', desc: 'Источники: прямой, поиск, соцсети, реклама' },
  { icon: '📄', title: 'Страницы', desc: 'Популярные страницы, глубина просмотра' },
  { icon: '🌍', title: 'География', desc: 'Города и регионы посетителей' },
  { icon: '📱', title: 'Устройства', desc: 'Desktop, mobile, tablet — доли' },
  { icon: '⏱️', title: 'Поведение', desc: 'Время на сайте, показатель отказов' },
]

export function AnalyticsPage() {
  const [counterId, setCounterId] = useState('')
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'setup' | 'api'>('setup')

  function handleSave() {
    if (!counterId.trim()) return
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const publicUrl = counterId ? `https://metrika.yandex.ru/stat/traffic?id=${counterId}` : null

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Аналитика</h1>
          <p className={styles.subtitle}>Яндекс.Метрика — статистика посещаемости сайта</p>
        </div>
        {publicUrl && (
          <a href={publicUrl} target="_blank" rel="noopener noreferrer" className={styles.openBtn}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Открыть в Яндекс.Метрике
          </a>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'setup' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('setup')}
        >
          Подключение
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'api' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('api')}
        >
          Возможности API
        </button>
      </div>

      {activeTab === 'setup' && (
        <div className={styles.setupWrap}>
          {/* Steps */}
          <div className={styles.stepsCard}>
            <h2 className={styles.cardTitle}>Как подключить</h2>
            <div className={styles.steps}>
              {SETUP_STEPS.map((step) => (
                <div key={step.num} className={styles.step}>
                  <div className={styles.stepNum}>{step.num}</div>
                  <div className={styles.stepBody}>
                    <div className={styles.stepTitle}>{step.title}</div>
                    <div className={styles.stepDesc}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connect form */}
          <div className={styles.connectCard}>
            <h2 className={styles.cardTitle}>ID счётчика</h2>
            <p className={styles.connectDesc}>
              После настройки публичного доступа вставьте ID счётчика — статистика появится прямо в
              этом разделе.
            </p>
            <div className={styles.connectForm}>
              <input
                className={styles.connectInput}
                type="text"
                placeholder="Например: 98765432"
                value={counterId}
                onChange={(e) => setCounterId(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
              />
              <button className={styles.connectBtn} onClick={handleSave}>
                {saved ? '✓ Сохранено' : 'Сохранить'}
              </button>
            </div>
            {counterId && (
              <div className={styles.connectHint}>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Публичный URL:{' '}
                <a
                  href={`https://metrika.yandex.ru/stat/traffic?id=${counterId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.hintLink}
                >
                  metrika.yandex.ru/stat/traffic?id={counterId}
                </a>
              </div>
            )}
          </div>

          {/* Iframe preview / placeholder */}
          {publicUrl ? (
            <div className={styles.iframeCard}>
              <div className={styles.iframeHeader}>
                <h2 className={styles.cardTitle}>Статистика</h2>
                <span className={styles.iframeLive}>live</span>
              </div>
              <div className={styles.iframeWrap}>
                <iframe
                  src={publicUrl}
                  className={styles.iframe}
                  title="Яндекс.Метрика"
                  loading="lazy"
                />
              </div>
            </div>
          ) : (
            <div className={styles.placeholderCard}>
              <div className={styles.placeholderIcon}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div className={styles.placeholderTitle}>Статистика не подключена</div>
              <div className={styles.placeholderDesc}>
                Введите ID счётчика выше — здесь появится встроенный дашборд Яндекс.Метрики с
                реальными данными о посещаемости.
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'api' && (
        <div className={styles.apiWrap}>
          <div className={styles.apiInfo}>
            <div className={styles.apiInfoIcon}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <div className={styles.apiInfoTitle}>Яндекс.Метрика Reporting API существует</div>
              <div className={styles.apiInfoDesc}>
                API позволяет получать любые данные программно. Для интеграции потребуется
                OAuth-токен и ID счётчика. Можем добавить в следующем спринте.
              </div>
            </div>
          </div>

          <div className={styles.capGrid}>
            {API_CAPABILITIES.map((cap) => (
              <div key={cap.title} className={styles.capCard}>
                <span className={styles.capIcon}>{cap.icon}</span>
                <div className={styles.capTitle}>{cap.title}</div>
                <div className={styles.capDesc}>{cap.desc}</div>
              </div>
            ))}
          </div>

          <div className={styles.apiEndpoints}>
            <h2 className={styles.cardTitle}>Ключевые endpoint-ы</h2>
            <div className={styles.endpoints}>
              {[
                {
                  method: 'GET',
                  path: '/stat/v1/data',
                  desc: 'Основные метрики (визиты, просмотры, пользователи)',
                },
                {
                  method: 'GET',
                  path: '/stat/v1/data/bytime',
                  desc: 'Данные в разрезе времени (по дням, неделям)',
                },
                {
                  method: 'GET',
                  path: '/stat/v1/data/drilldown',
                  desc: 'Детализация по измерениям',
                },
                {
                  method: 'GET',
                  path: '/management/v1/counter/{id}',
                  desc: 'Информация о счётчике',
                },
              ].map((ep) => (
                <div key={ep.path} className={styles.endpoint}>
                  <span className={styles.epMethod}>{ep.method}</span>
                  <code className={styles.epPath}>{ep.path}</code>
                  <span className={styles.epDesc}>{ep.desc}</span>
                </div>
              ))}
            </div>
            <div className={styles.apiNote}>
              Base URL: <code className={styles.apiCode}>https://api-metrika.yandex.net</code> ·
              Требует заголовок{' '}
              <code className={styles.apiCode}>Authorization: OAuth {'{token}'}</code>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
