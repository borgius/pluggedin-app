'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthForm } from '@/components/auth/auth-form';

type AuthLayoutProps = {
  type: 'login' | 'register' | 'forgot-password' | 'reset-password';
  children?: ReactNode;
};

type LinkConfigType = {
  text: string;
  linkText: string;
  href: string;
};

export function AuthLayout({ type, children }: AuthLayoutProps) {
  const { t } = useTranslation();
  
  // Define the link configuration for each auth type
  const getLinkConfig = (): LinkConfigType | LinkConfigType[] => {
    switch (type) {
      case 'login':
        return [
          {
            text: t('auth.links.login.noAccount'),
            linkText: t('auth.links.login.signUp'),
            href: "/register",
          },
          {
            text: "",
            linkText: t('auth.links.login.forgotPassword'),
            href: "/forgot-password",
          },
        ];
      case 'register':
        return {
          text: t('auth.links.register.hasAccount'),
          linkText: t('auth.links.register.signIn'),
          href: "/login",
        };
      case 'forgot-password':
      case 'reset-password':
        return {
          text: t('auth.links.forgotPassword.rememberPassword'),
          linkText: t('auth.links.forgotPassword.backToLogin'),
          href: "/login",
        };
      default:
        return {
          text: "",
          linkText: "",
          href: "/",
        };
    }
  };

  const linkConfig = getLinkConfig();
  const hasMultipleLinks = Array.isArray(linkConfig);

  return (
    <div className="space-y-6">
      <AuthForm type={type} />
      
      <div className={`text-center ${hasMultipleLinks ? 'space-y-2' : ''}`}>
        {hasMultipleLinks ? (
          // Render multiple links (login page case)
          linkConfig.map((config, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {config.text && (
                <>{config.text}{' '}</>
              )}
              <Link
                href={config.href}
                className="underline underline-offset-4 hover:text-primary"
              >
                {config.linkText}
              </Link>
            </p>
          ))
        ) : (
          // Render single link (register, forgot-password, reset-password)
          <p className="text-sm text-muted-foreground">
            {linkConfig.text && (
              <>{linkConfig.text}{' '}</>
            )}
            <Link
              href={linkConfig.href}
              className="underline underline-offset-4 hover:text-primary"
            >
              {linkConfig.linkText}
            </Link>
          </p>
        )}
      </div>

      {children}
    </div>
  );
} 