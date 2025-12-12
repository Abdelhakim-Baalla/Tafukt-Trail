import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="layout">
      <Navbar />
      <main className="main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;