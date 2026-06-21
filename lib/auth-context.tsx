'use client';

import React, { createContext, useContext } from 'react';
import { useUser as useClerkUser } from '@clerk/nextjs';

interface UserMock {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  username: string | null;
  imageUrl: string;
  emailAddresses: { emailAddress: string }[];
}

interface AuthContextProps {
  user: UserMock | null;
  isLoaded: boolean;
  isSignedIn: boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const disableClerk = process.env.NEXT_PUBLIC_DISABLE_CLERK === 'true';

  if (disableClerk) {
    return (
      <AuthContext.Provider value={{
        user: {
          id: 'user_mock123',
          firstName: 'Sarah',
          lastName: 'Jenkins',
          fullName: 'Sarah Jenkins',
          username: 'sarah_jenkins',
          imageUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
          emailAddresses: [{ emailAddress: 'sarah@auraflow.io' }]
        },
        isLoaded: true,
        isSignedIn: true
      }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return <ClerkAuthProviderWrapper>{children}</ClerkAuthProviderWrapper>;
}

function ClerkAuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClerkUserConnector>
      {children}
    </ClerkUserConnector>
  );
}

function ClerkUserConnector({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useClerkUser();
  
  // Format the user object standardly
  const formattedUser = user ? {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    username: user.username,
    imageUrl: user.imageUrl,
    emailAddresses: user.emailAddresses.map(e => ({ emailAddress: e.emailAddress }))
  } : null;

  return (
    <AuthContext.Provider value={{ user: formattedUser, isLoaded, isSignedIn: !!isSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAppUser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAppUser must be used within AuthProvider');
  }
  return context;
}
