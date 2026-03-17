'use client'

import { useState, useEffect } from 'react'
import styles from './AnalyticsPage.module.css'

export function AnalyticsPage() {
  const [counterId, setCounterId] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: Record<string, string>) => {
        setCounterId(data['metrikaId'] ?? '')
        setLoading(false)
      })
  }, [])

  async function handleSave() {
    if (!counterId.trim()) return
    setSaving(true)
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metrikaId: counterId.trim() }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function handleClear() {
    setCounterId('')
    setSaving(true)
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metrikaId: '' }),
    })
    setSaving(false)
  }

  const metrikaUrl = counterId ? `https://metrika.yandex.ru/stat/traffic?id=${counterId}` : null

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Аналитика</h1>
          <p className={styles.subtitle}>Яндекс.Метрика — статистика посещаемости сайта</p>
        </div>
        {metrikaUrl && (
          <a href={metrikaUrl} target="_blank" rel="noopener noreferrer" className={styles.openBtn}>
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

      {/* Статус */}
      <div
        className={`${styles.statusBanner} ${counterId ? styles.statusActive : styles.statusInactive}`}
      >
        <span className={styles.statusDot} />
        {loading
          ? 'Загрузка...'
          : counterId
            ? `Счётчик #${counterId} активен — скрипт Метрики встроен на все страницы сайта автоматически`
            : 'Счётчик не подключён — введите ID ниже'}
      </div>

      <div className={styles.setupWrap}>
        {/* Инструкция */}
        <div className={styles.stepsCard}>
          <h2 className={styles.cardTitle}>Как подключить</h2>
          <div className={styles.steps}>
            {[
              {
                num: '01',
                title: 'Создайте счётчик',
                desc: 'Зайдите на metrika.yandex.ru → «Добавить счётчик». Укажите домен сайта.',
              },
              {
                num: '02',
                title: 'Скопируйте ID',
                desc: 'ID — это 8-значное число в адресной строке после создания счётчика.',
              },
              {
                num: '03',
                title: 'Вставьте ID ниже и сохраните',
                desc: 'Скрипт Метрики автоматически появится на всех страницах сайта. Больше ничего менять не нужно.',
              },
              {
                num: '04',
                title: 'Смотрите статистику',
                desc: 'Через 1–2 дня данные накопятся. Статистику удобно смотреть прямо в Метрике по кнопке выше.',
              },
            ].map((step) => (
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

        {/* Форма */}
        <div className={styles.connectCard}>
          <h2 className={styles.cardTitle}>ID счётчика</h2>
          <p className={styles.connectDesc}>
            После сохранения скрипт Яндекс.Метрики автоматически встраивается на все публичные
            страницы — никаких правок в коде или конфигах не требуется.
          </p>
          <div className={styles.connectForm}>
            <input
              className={styles.connectInput}
              type="text"
              placeholder="Например: 98765432"
              value={counterId}
              onChange={(e) => setCounterId(e.target.value.replace(/\D/g, ''))}
              maxLength={10}
              disabled={loading}
            />
            <button
              className={styles.connectBtn}
              onClick={handleSave}
              disabled={saving || loading || !counterId.trim()}
            >
              {saved ? '✓ Сохранено' : saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            {counterId && (
              <button className={styles.clearBtn} onClick={handleClear} disabled={saving}>
                Отключить
              </button>
            )}
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Скрипт активен. Данные начнут поступать сразу после первого визита на сайт.
            </div>
          )}
        </div>

        {/* Что отслеживает Метрика */}
        <div className={styles.capCard}>
          <h2 className={styles.cardTitle}>Что отслеживает Яндекс.Метрика</h2>
          <div className={styles.capGrid}>
            {[
              {
                icon: '👥',
                title: 'Посетители',
                desc: 'Уникальные пользователи, новые vs вернувшиеся',
              },
              { icon: '📈', title: 'Трафик', desc: 'Источники: поиск, прямые, соцсети, реклама' },
              { icon: '📄', title: 'Страницы', desc: 'Популярные страницы, глубина просмотра' },
              { icon: '🌍', title: 'География', desc: 'Города и регионы посетителей' },
              { icon: '📱', title: 'Устройства', desc: 'Desktop, mobile, tablet — доли' },
              {
                icon: '🎥',
                title: 'Вебвизор',
                desc: 'Запись сессий — видно как ведут себя пользователи',
              },
            ].map((cap) => (
              <div key={cap.title} className={styles.cap}>
                <span className={styles.capIcon}>{cap.icon}</span>
                <div className={styles.capTitle}>{cap.title}</div>
                <div className={styles.capDesc}>{cap.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
