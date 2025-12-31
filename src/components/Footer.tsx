const Footer = () => {
  return (
    <footer style={{ 
      padding: '2rem 0', 
      textAlign: 'center', 
      backgroundColor: '#f9f9f9', 
      borderTop: '1px solid #eee',
      marginTop: 'auto' 
    }}>
      <div style={{ marginBottom: '1rem', fontSize: '1rem', color: '#333' }}>
        © 2025 AI English Speaking Platform
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '25px', 
        color: '#555', 
        fontSize: '0.9rem' 
      }}>
        <span style={{ cursor: 'pointer' }}>Giới thiệu</span>
        <span style={{ cursor: 'pointer' }}>Điều khoản</span>
        <span style={{ cursor: 'pointer' }}>Chính sách</span>
        <span style={{ cursor: 'pointer' }}>Hỗ trợ</span>
      </div>
    </footer>
  );
};

export default Footer;