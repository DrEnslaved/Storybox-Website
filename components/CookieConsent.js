'use client'

import { useEffect } from 'react'
import CookieConsent from 'react-cookie-consent'
import Link from 'next/link'

export default function CookieConsentBanner() {
  useEffect(() => {
    // Check for keyboard navigation
    const handleFirstTab = (e) => {
      if (e.keyCode === 9) {
        document.body.classList.add('user-is-tabbing')
      }
    }

    window.addEventListener('keydown', handleFirstTab)
    return () => window.removeEventListener('keydown', handleFirstTab)
  }, [])

  return (
    <CookieConsent
      location="bottom"
      buttonText="Приемам"
      declineButtonText="Отказвам"
      cookieName="storvbox_cookie_consent"
      style={{
        background: '#1f2937',
        padding: '12px 16px',
        alignItems: 'center',
        fontSize: '13px',
        flexDirection: 'column',
        gap: '12px'
      }}
      buttonStyle={{
        background: '#15803d',
        color: '#ffffff',
        fontSize: '13px',
        padding: '8px 20px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '600',
        flex: '1',
        minWidth: '120px'
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: '#9ca3af',
        fontSize: '13px',
        padding: '8px 20px',
        borderRadius: '6px',
        border: '1px solid #4b5563',
        cursor: 'pointer',
        marginRight: '8px',
        flex: '1',
        minWidth: '120px'
      }}
      containerClasses="cookie-consent-container"
      buttonWrapperClasses="cookie-consent-buttons"
      expires={365}
      enableDeclineButton
      onAccept={() => {
        console.log('Cookie consent accepted')
      }}
      onDecline={() => {
        console.log('Cookie consent declined')
      }}
      aria-label="Cookie consent banner"
    >
      <span role="alert" style={{ textAlign: 'center', lineHeight: '1.5' }}>
        Използваме бисквитки (cookies) за подобряване на вашето изживяване на уебсайта. 
        Продължавайки да използвате сайта, вие се съгласявате с използването на бисквитки.{' '}
        <Link href="/privacy" className="underline hover:text-green-500">
          Научете повече
        </Link>
      </span>
    </CookieConsent>
  )
}