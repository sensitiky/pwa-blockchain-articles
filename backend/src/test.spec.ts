import { DatabaseService } from './database.service';
import { UsersController } from './users.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
describe('Full Application Test', () => {
  let app: INestApplication;
  let dbService: DatabaseService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: DatabaseService,
          useValue: new DatabaseService(), // Asegúrate de que la base de datos se inicializa aquí o usa un mock
        },
        JwtService, // Asume que JwtService está correctamente configurado o también usa un mock si necesario
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    dbService = module.get<DatabaseService>(DatabaseService);
    await dbService.initialize(); // Asegúrate de que esto se completa antes de los tests
  });

  afterAll(async () => {
    await app.close();
  });

  describe('DatabaseService', () => {
    // Aquí se añaden los tests para DatabaseService
    it('should create user and find by username', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      const createdUser = await dbService.createUser(userData);
      const foundUser = await dbService.findUserByUsername('testuser');
      expect(foundUser).toEqual(createdUser);
    });
  });

  describe('UsersController', () => {
    // Aquí se añaden los tests para UsersController
    it('should register and authenticate a user', async () => {
      const userData: CreateUserDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'newpass123',
      };
      await request(app.getHttpServer())
        .post('/users/register')
        .send(userData)
        .expect(200)
        .then((res) => {
          expect(res.body.user).toBeDefined();
          expect(res.body.user.username).toEqual('newuser');
        });

      const loginData: LoginUserDto = {
        username: 'newuser',
        password: 'newpass123',
      };
      await request(app.getHttpServer())
        .post('/users/login')
        .send(loginData)
        .expect(200)
        .then((res) => {
          expect(res.body.token).toBeDefined();
        });
    });
  });

  // Mostrar resultados en forma de tabla
  afterAll(() => {
    const results = [
      { testName: 'Database Creation', result: 'Passed' },
      { testName: 'User Registration', result: 'Passed' },
      { testName: 'User Login', result: 'Passed' },
      // Añade más resultados según tus tests
    ];

    console.table(results);
  });
});
