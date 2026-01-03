import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0.8rem 5%', 
      background: '#fff', 
      borderBottom: '1px solid #eee',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* 2. Bọc Logo bằng Link để bấm vào là về Trang chủ */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
        <span style={{ 
          fontSize: '1.8rem', 
          fontWeight: 'bold', 
          color: '#007bff',
          letterSpacing: '1px'
        }}>
          AESP
        </span>
        <span style={{ 
          fontSize: '0.7rem', 
          fontWeight: '600', 
          color: '#6c757d',
          textTransform: 'uppercase'
        }}>
          AI English Speaking Platform
        </span>
      </Link>

      <nav>
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
          <li>
            <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>Trang chủ</Link>
          </li>
          <li>
            <Link to="/scenarios" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>
  Luyện tập
</Link>
          </li>
          <li>
            <Link to="#" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>Lộ trình</Link>
          </li>
        </ul>
      </nav>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button style={{ 
          padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #007bff', 
          background: 'transparent', color: '#007bff', cursor: 'pointer', fontWeight: 'bold'
        }}>
          Đăng nhập
        </button>
        <button style={{ 
          padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', 
          background: '#007bff', color: '#fff', cursor: 'pointer', fontWeight: 'bold'
        }}>
          Đăng ký
        </button>
      </div>
    </header>
  );
};

export default Header;