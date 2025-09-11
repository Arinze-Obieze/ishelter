'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { app as firebaseApp } from '@/lib/firebase';

export default function FinishSignInPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(firebaseApp);

    async function completeSignIn() {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');

        if (!email) {
          email = window.prompt('Please confirm your email to complete sign-in');
          if (!email) {
            router.replace('/login');
            return;
          }
        }

        try {
          await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem('emailForSignIn');

          await auth.currentUser.reload();
          const hasPassword = auth.currentUser.providerData.some(
            (provider) => provider.providerId === 'password'
          );

          router.replace(hasPassword ? '/dashboard' : '/set-password');
        } catch (error) {
          console.error('Sign-in error:', error);
          router.replace('/login');
        }
      }
    }

    completeSignIn();
  }, [router]);

  return <div className="p-6 text-center">Finishing sign-in...</div>;
}
