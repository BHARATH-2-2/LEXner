import './globals.css';
import { AuthProvider } from '../components/AuthProvider';
import Nav from '../components/Nav';

export const metadata = {
  title: 'LEXner',
  description: 'Legal NER + Graph Explorer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Nav />
          <div className="container">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
