import React from 'react';
import Header from './Header';
import Container from './Container';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  headerTitle?: string;
  showAuth?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  headerTitle,
  showAuth = true,
  maxWidth = 'xl',
  className = ''
}) => {
  React.useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={headerTitle}
        showAuth={showAuth}
      />
      
      <main className={`py-8 ${className}`}>
        <Container maxWidth={maxWidth}>
          {children}
        </Container>
      </main>
    </div>
  );
};

export default PageLayout;