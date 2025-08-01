import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../apps/auth-service/src/auth-service.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../libs/entities/user.entity';

// Mock các dependency bên ngoài
jest.mock('../utils/password-util', () => ({
  comparePassword: jest.fn().mockResolvedValue(true),
  hashPassword: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
  __esModule: true,
  default: {
    sign: jest.fn().mockReturnValue('mocked-access-token'),
  },
  sign: jest.fn().mockReturnValue('mocked-access-token'),
}));

// Tắt toàn bộ console.log khi test
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

// Khối test chính cho AuthService
describe('AuthService E2E', () => {
  let authService: AuthService;
  let userRepositoryMock: Record<string, any>;

  // Setup module và mock repository
  beforeAll(async () => {
    userRepositoryMock = {
      findOne: jest.fn().mockResolvedValue({
        id: 1,
        email: 'test@mail.com',
        username: 'testuser',
        password: 'hashed',
      }),
    };
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
      ],
    }).compile();
    authService = moduleRef.get<AuthService>(AuthService);
  });

  // Test khởi tạo service
  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  // Test validateUser với thông tin hợp lệ
  it('should validate user with correct credentials', async () => {
    const result = await authService.validateUser('test@mail.com', 'password');
    expect(result.user).toBeDefined();
    expect(result.user?.email).toBe('test@mail.com');
  });

  // Thêm các test case tổng hợp cho các hàm chính của AuthService
});
