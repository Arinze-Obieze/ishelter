'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import firebaseApp from '@/lib/firebase';

export default function FinishSignInPage() {
  const router = useRouter();
  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const email = window.localStorage.getItem('emailForSignIn');
    if (isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, email, window.location.href)
        .then(async (result) => {
          await auth.currentUser.reload();
          const hasPassword = auth.currentUser.providerData.some(
            (provider) => provider.providerId === 'password'
          );
          if (!hasPassword) {
            router.replace('/set-password');
          } else {
            router.replace('/dashboard');
          }
        })
        .catch(() => router.replace('/login'));
    }
  }, [router]);
  return <div>Finishing sign-in...</div>;
}
