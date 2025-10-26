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
        fontSize: '12px',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: '12px',
        maxWidth: '100%',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: '50'
      }}
      buttonStyle={{
        background: '#15803d',
        color: '#ffffff',
        fontSize: '12px',
        padding: '6px 16px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '600',
        whiteSpace: 'nowrap'
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: '#9ca3af',
        fontSize: '12px',
        padding: '6px 16px',
        borderRadius: '6px',
        border: '1px solid #4b5563',
        cursor: 'pointer',
        marginRight: '8px',
        whiteSpace: 'nowrap'
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
      <span role="alert" style={{ lineHeight: '1.4', flex: '1' }}>
        Използваме бисквитки за подобряване на изживяването.{' '}
        <Link href="/privacy" className="underline hover:text-green-400">
          Научете повече
        </Link>
      </span>
    </CookieConsent>
  )
}