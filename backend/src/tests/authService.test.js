const AuthService = require('../services/authService');
const utilisateurRepository = require('../repositories/UtilisateurRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../repositories/UtilisateurRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = { email: 'test@test.com', motDePasse: 'password123', role: 'CHAUFFEUR' };
      const mockUser = { _id: '123', ...userData };

      utilisateurRepository.findByEmail.mockResolvedValue(null);
      utilisateurRepository.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('token123');

      const result = await AuthService.register(userData);

      expect(utilisateurRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(utilisateurRepository.create).toHaveBeenCalledWith(userData);
      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe('token123');
    });

    it('should throw error if email already exists', async () => {
      const userData = { email: 'existing@test.com', motDePasse: 'password123' };
      utilisateurRepository.findByEmail.mockResolvedValue({ _id: '456' });

      await expect(AuthService.register(userData)).rejects.toThrow('Un utilisateur avec cet email existe déjà.');
    });
  });

  describe('login', () => {
    it('should login user with correct credentials', async () => {
      const email = 'test@test.com';
      const password = 'password123';
      const mockUser = { _id: '123', email, motDePasse: 'hashed_password', role: 'CHAUFFEUR' };

      utilisateurRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token123');

      const result = await AuthService.login(email, password);

      expect(utilisateurRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.motDePasse);
      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe('token123');
    });

    it('should throw error if user not found', async () => {
      utilisateurRepository.findByEmail.mockResolvedValue(null);

      await expect(AuthService.login('notfound@test.com', 'password')).rejects.toThrow('Email ou mot de passe incorrect.');
    });

    it('should throw error if password is incorrect', async () => {
      const mockUser = { _id: '123', email: 'test@test.com', motDePasse: 'hashed_password' };
      utilisateurRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(AuthService.login('test@test.com', 'wrongpassword')).rejects.toThrow('Email ou mot de passe incorrect.');
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const user = { _id: '123', role: 'ADMIN' };
      jwt.sign.mockReturnValue('token123');

      const token = AuthService.generateToken(user);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      expect(token).toBe('token123');
    });
  });

  describe('comparePassword', () => {
    it('should return true if passwords match', async () => {
      bcrypt.compare.mockResolvedValue(true);

      const result = await AuthService.comparePassword('password123', 'hashed_password');

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(result).toBe(true);
    });

    it('should return false if passwords do not match', async () => {
      bcrypt.compare.mockResolvedValue(false);

      const result = await AuthService.comparePassword('password123', 'different_hash');

      expect(result).toBe(false);
    });
  });
});
