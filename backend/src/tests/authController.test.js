const AuthController = require('../controllers/authController');
const AuthService = require('../services/authService');

jest.mock('../services/authService');

describe('AuthController', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Express request/response
    req = {
      body: {},
      user: null
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    
    next = jest.fn();
  });

  describe('register', () => {
    it('should register user and return token', async () => {
      const userData = { email: 'test@test.com', motDePasse: 'password123', role: 'CHAUFFEUR' };
      const mockUser = { _id: '123', ...userData };
      const mockToken = 'token123';

      req.body = userData;
      AuthService.register.mockResolvedValue({ user: mockUser, token: mockToken });

      await AuthController.register(req, res, next);

      expect(AuthService.register).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Utilisateur créé avec succès',
        user: mockUser,
        token: mockToken
      });
    });

    it('should handle registration error', async () => {
      const userData = { email: 'test@test.com', motDePasse: 'password123' };
      const error = new Error('Email already exists');

      req.body = userData;
      AuthService.register.mockRejectedValue(error);

      await AuthController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('should login user and return token', async () => {
      const loginData = { email: 'test@test.com', motDePasse: 'password123' };
      const mockUser = { _id: '123', email: 'test@test.com', role: 'CHAUFFEUR' };
      const mockToken = 'token123';

      req.body = loginData;
      AuthService.login.mockResolvedValue({ user: mockUser, token: mockToken });

      await AuthController.login(req, res, next);

      expect(AuthService.login).toHaveBeenCalledWith(loginData.email, loginData.motDePasse);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Connexion réussie',
        user: mockUser,
        token: mockToken
      });
    });

    it('should handle login error', async () => {
      const loginData = { email: 'test@test.com', motDePasse: 'wrongpassword' };
      const error = new Error('Invalid credentials');

      req.body = loginData;
      AuthService.login.mockRejectedValue(error);

      await AuthController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
