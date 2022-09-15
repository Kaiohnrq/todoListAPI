import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let tarefaId: Number

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'db_todo_test',
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
        dropSchema: true
      }),
    AppModule
    ],
    
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('inserir dado no banco', async() => {
    let response = await request(app.getHttpServer())
    .post('/tarefa')
    .send({ 
            nome: 'primeira tarefa',
            descricao: 'minha primeira tarefa',
            responsavel: 'kaio',
            data: '2022-09-02',
            status: true
          })
    .expect(201)
    tarefaId = response.body.id
  })

  it('Recupera tarefa', async () => {
    return request(app.getHttpServer())
      .get(`/tarefa/${tarefaId}`)
      .expect(200)
  })

  it('Atualiza tarefa', async () => {
    return request(app.getHttpServer())
      .put('/tarefa')
      .send({
        id: 1,
        nome: "Primeira tarefa atualizada",
        descricao: "minha primeira tarefa",
        responsavel: "kaio",
        data: "2022-09-02",
        status: true
      })
      .expect(200)
      .then(response => {
      expect('Primeira tarefa atualizada').toEqual(response.body.nome)
    })
  })

  it('Ver se retorna erro NOT_FOUND', async() => {
    return request(app.getHttpServer())
      .put('/tarefa')
      .send({
        id: 1000,
        nome: "joaozin",
        descricao: "joazin",
        responsavel: "bruna",
        data: "2022-09-02",
        status: true
    })
      .expect(404)
  })

  it('Deletar dado', async () =>{
    return request(app.getHttpServer())
      .delete(`/tarefa/${tarefaId}`)
      .expect(204)
  })

  afterAll(async () => {
    await app.close()
  })

}); 
