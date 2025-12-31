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
      <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', lineHeight: '1.2' }}>
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
      </div>

      
      <nav>
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
          <li style={{ cursor: 'pointer', fontWeight: '500' }}>Trang chủ</li>
          <li style={{ cursor: 'pointer', fontWeight: '500' }}>Luyện tập</li>
          <li style={{ cursor: 'pointer', fontWeight: '500' }}>Lộ trình</li>
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