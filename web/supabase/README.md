# Supabase 설정

## 1. 식단 테이블 만들기

Supabase Dashboard에서 **SQL Editor**를 열고
[`migrations/202611040001_meal_entries.sql`](./migrations/202611040001_meal_entries.sql)의
내용을 실행합니다. 이 SQL이 식단 기록 테이블과 사용자별 접근 정책(RLS)을 만듭니다.

## 2. 웹 앱에 공개 키 연결하기

[`web/.env.local.example`](../.env.local.example)을 참고해 `web/.env.local`에
프로젝트 URL과 **publishable key**를 넣습니다. `service_role` 또는 secret key는
브라우저에서 사용하는 환경 변수에 넣으면 안 됩니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

## 3. 매직링크가 돌아올 주소 허용하기

Supabase Dashboard의 **Authentication → URL Configuration → Redirect URLs**에
아래 두 주소를 추가합니다.

- `http://localhost:3000/auth/confirm`
- `https://www.oreathalf.com/auth/confirm`

## 4. 매직링크 이메일의 로그인 버튼 주소 바꾸기

Supabase Dashboard에서 **Authentication → Email Templates → Magic Link**로
이동합니다. 이메일 템플릿의 본문을 아래 HTML로 교체하고 저장합니다.

```html
<h2>oreathalf 로그인</h2>
<p>아래 버튼을 눌러 로그인하고 식단 기록을 백업하세요.</p>
<p>
  <a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email">
    로그인하고 기록 백업하기
  </a>
</p>
```

이 단계는 앱의 `/auth/confirm` 경로가 Supabase의 1회용 `token_hash`를 받아
로그인 세션을 만들도록 이메일 링크를 연결합니다. 그대로 두면 인증 코드가 이
콜백 경로에 전달되지 않아 로그인이 완료되지 않고, 브라우저 기록도 백업되지
않습니다. Supabase는 PKCE 매직링크에 `token_hash`를 사용하는 흐름을 안내합니다.

로그인 전 기록은 요청한 브라우저의 `localStorage`에 남습니다. 기존 기록을
백업하려면 매직링크를 요청했던 바로 그 브라우저에서 이메일 링크를 여세요.
