import React from 'react'

const WelcomeDialog = ({setOpenJoinDialog}) => {
  return (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(26,16,36,0.85)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
        onClick={() => setOpenJoinDialog(false)}
      >
        <div
          style={{
            background: '#fff',
            color: '#2F013E',
            borderRadius: 16,
            padding: 36,
            minWidth: 340,
            maxWidth: 400,
            boxShadow: '0 8px 32px #9A02E244',
            border: '2px solid #9A02E2',
            textAlign: 'center',
            position: 'relative',
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => setOpenJoinDialog(false)}
            style={{
              position: 'absolute',
              top: 12,
              right: 16,
              background: 'none',
              border: 'none',
              fontSize: 22,
              color: '#9A02E2',
              cursor: 'pointer',
            }}
            aria-label="Close"
          >×</button>
          <h2 style={{ color: '#9A02E2', fontWeight: 800, marginBottom: 12 }}>Welcome to JobNRide!</h2>
          <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 18 }}>
            Thank you for your interest in joining our community.<br />
            Download the JobNRide app to get started and unlock exclusive features!
          </p>
          <div style={{ marginBottom: 18 }}>
            <a
              href="https://play.google.com/store/apps/details?id=com.kdads.jobnride&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#9A02E2',
                color: '#fff',
                fontWeight: 700,
                borderRadius: 8,
                padding: '10px 24px',
                textDecoration: 'none',
                boxShadow: '0 2px 8px #9A02E244',
                border: '1.5px solid #9A02E2',
                marginRight: 12,
                fontSize: 16,
                marginBottom: 8,
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              Download for Android
            </a>
            <a
              href="https://apps.apple.com/app/id0000000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#9A02E2',
                color: '#fff',
                fontWeight: 700,
                borderRadius: 8,
                padding: '10px 24px',
                textDecoration: 'none',
                boxShadow: '0 2px 8px #9A02E244',
                border: '1.5px solid #9A02E2',
                fontSize: 16,
                marginBottom: 8,
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              Download for iOS
            </a>
          </div>
          <p style={{ fontSize: 15, color: '#555', marginBottom: 0 }}>
            Already have the app? <b>Sign in</b> to start connecting, referring, and sharing rides!
          </p>
        </div>
      </div>
  )
}

export default WelcomeDialog