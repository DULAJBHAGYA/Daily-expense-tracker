"use client"
import React from 'react';
import { SignIn } from '@clerk/nextjs';


const SignInPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <SignIn signUpUrl="/sign-up" afterSignInUrl="/dashboard" />
    </div>
  );
};

export default SignInPage;
