const AuthService = require('../../../services/authService');
const utilisateurRepository = require('../../../repositories/UtilisateurRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../../repositories/UtilisateurRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('register', () => {
    it('should register user', async () => {
      const userData = { email: 'test@test.com', motDePasse: 'pass123', role: 'CHAUFFEUR' };
      const mockUser = { _id: '1', ...userData };

      utilisateurRepository.findByEmail.mockResolvedValue(null);
      utilisateurRepository.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('token123');

      const result = await AuthService.register(userData);

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe('token123');
    });

    it('should throw if email exists', async () => {
      utilisateurRepository.findByEmail.mockResolvedValue({ _id: '1' });

      await expect(AuthService.register({ email: 'test@test.com', motDePasse: 'pass' }))
        .rejects.toThrow('Un utilisateur avec cet email existe déjà');
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const mockUser = { _id: '1', email: 'test@test.com', motDePasse: 'hashed', role: 'CHAUFFEUR' };

      utilisateurRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token123');

      const result = await AuthService.login('test@test.com', 'pass123');

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe('token123');
    });

    it('should throw if user not found', async () => {
      utilisateurRepository.findByEmail.mockResolvedValue(null);

      await expect(AuthService.login('notfound@test.com', 'pass'))
        .rejects.toThrow('Email ou mot de passe incorrect');
    });

    it('should throw if password wrong', async () => {
      const mockUser = { _id: '1', email: 'test@test.com', motDePasse: 'hashed' };

      utilisateurRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(AuthService.login('test@test.com', 'wrongpass'))
        .rejects.toThrow('Email ou mot de passe incorrect');
    });
  });
});
