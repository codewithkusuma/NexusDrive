import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card" style={{ width: '90%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '16px', 
            backgroundColor: 'rgba(59, 130, 246, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <UserPlus size={32} color="var(--accent)" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Join NexusDrive today</p>
        </div>
        
        {error && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--danger)', 
            padding: '0.75rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem', 
            fontSize: '0.85rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)' }}>Username</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="johndoe"
              value={username} 
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError('');
              }} 
              required 
            />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)' }}>Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="name@example.com"
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }} 
              required 
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)' }}>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }} 
              required 
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '1rem', borderRadius: '10px' }}>
            Register
          </button>
        </form>
        
        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
