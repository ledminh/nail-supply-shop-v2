import { withClerkMiddleware, getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePaths = ['/admin*'];

const isPublic = (path: string) => {
  return !privatePaths.find(x =>
    path.match(new RegExp(`^${x}$`.replace('*$', '($|/)')))
  )
}

const handler = (request: NextRequest) => {
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next()
  }
  // if the user is not signed in redirect them to the sign in page.
  const { userId } = getAuth(request)

  if (!userId) {
    // redirect the users to /pages/sign-in/[[...index]].ts
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect_url', request.url)
    return NextResponse.redirect(signInUrl)
  }
  return NextResponse.next()
}

export default withClerkMiddleware(handler);

export const config = { matcher:  ['/admin/:path*']};