import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Lumi — Turn Daily Habits into an RPG';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#160F24',
          backgroundImage:
            'radial-gradient(circle at 85% 15%, rgba(153, 102, 204, 0.35) 0%, transparent 50%), radial-gradient(circle at 15% 85%, rgba(122, 75, 194, 0.25) 0%, transparent 50%)',
          padding: '60px 70px',
          fontFamily: 'sans-serif',
          color: '#FFFFFF',
          border: '12px solid #2E2438',
        }}
      >
        {/* Top Header Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                backgroundColor: '#9966CC',
                border: '2px solid #FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 800,
                color: '#FFFFFF',
              }}
            >
              ✦
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  letterSpacing: '2px',
                  color: '#FFFFFF',
                }}
              >
                LUMI
              </span>
              <span
                style={{
                  fontSize: '13px',
                  color: '#C4B5FD',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                Autonomous 3D Companion & Habit RPG
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(153, 102, 204, 0.25)',
              border: '1.5px solid rgba(196, 181, 253, 0.4)',
              padding: '8px 18px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#F5D061',
              letterSpacing: '1px',
            }}
          >
            ★ FREE & OPEN SOURCE · MIT
          </div>
        </div>

        {/* Center Hero Message */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '960px',
          }}
        >
          <div
            style={{
              fontSize: '15px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: '#A78BFA',
              fontWeight: 800,
            }}
          >
            Gamified Productivity · Habit RPG
          </div>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 900,
              lineHeight: '1.08',
              letterSpacing: '-1.5px',
              margin: 0,
              color: '#FFFFFF',
            }}
          >
            Turn Habits into an RPG.
            <br />
            <span style={{ color: '#C084FC' }}>Level Up Your Real Life.</span>
          </h1>
          <p
            style={{
              fontSize: '22px',
              lineHeight: '1.4',
              color: '#D8B4FE',
              margin: 0,
              fontWeight: 500,
              maxWidth: '850px',
            }}
          >
            Replace delayed gratification with instant dopamine loops: XP curves, 5 character
            attributes, boss raids, and your living 3D companion.
          </p>
        </div>

        {/* Bottom Feature Pill Grid */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid rgba(196, 181, 253, 0.2)',
            paddingTop: '24px',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#E9D5FF',
              }}
            >
              5 Real Attributes
            </div>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#E9D5FF',
              }}
            >
              Interactive 3D Mascot
            </div>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#E9D5FF',
              }}
            >
              Pomodoro Focus Sanctuary
            </div>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#E9D5FF',
              }}
            >
              ADHD-Friendly Dopamine Loops
            </div>
          </div>

          <div
            style={{
              fontSize: '15px',
              fontWeight: 800,
              color: '#A78BFA',
              letterSpacing: '1px',
            }}
          >
            life-rpg.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
