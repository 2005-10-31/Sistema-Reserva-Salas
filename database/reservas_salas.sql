--TABELA: usuarios
CREATE TABLE usuarios (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'user',
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);


--Tabela salas
CREATE TABLE salas (
    id          SERIAL PRIMARY KEY, 
    nome        VARCHAR(100) NOT NULL UNIQUE,
    capacidade  INT          NOT NULL CHECK (capacidade > 0),
    localizacao VARCHAR(150) NOT NULL,
    descricao   VARCHAR(255)
);

--Tabela reservas
CREATE TABLE reservas (
    id          SERIAL PRIMARY KEY,
    id_usuario  INT       NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    id_sala     INT       NOT NULL REFERENCES salas(id)    ON DELETE CASCADE,
    data_inicio TIMESTAMP NOT NULL, 
    data_fim    TIMESTAMP NOT NULL,
    descricao   VARCHAR(255),
    status      VARCHAR(20) NOT NULL DEFAULT 'ativa',
    created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_datas CHECK (data_fim > data_inicio)
);

-- NOTA: As passwords abaixo são hashes bcrypt de "senha123"
-- Gerado com: bcrypt.hash('senha123', 10)
INSERT INTO usuarios (nome, email, password, role) VALUES
    ('Admin Sistema',    'admin@empresa.cv',    '$2a$10$O7XgnQXMqE.1Zbt8qvV9CeahoDuueZExIiFAOOabDqvx0wuu8DRA2', 'admin'),
    ('Kelly Fortes',     'kelly@empresa.cv',    '$2a$10$O7XgnQXMqE.1Zbt8qvV9CeahoDuueZExIiFAOOabDqvx0wuu8DRA2', 'user'),
    ('Jarni Timas',      'jarni@empresa.cv',    '$2a$10$O7XgnQXMqE.1Zbt8qvV9CeahoDuueZExIiFAOOabDqvx0wuu8DRA2', 'user'),
    ('Leonardo Dionisio','leonardo@empresa.cv', '$2a$10$O7XgnQXMqE.1Zbt8qvV9CeahoDuueZExIiFAOOabDqvx0wuu8DRA2', 'user'),
    ('William Pires',    'william@empresa.cv',  '$2a$10$O7XgnQXMqE.1Zbt8qvV9CeahoDuueZExIiFAOOabDqvx0wuu8DRA2', 'user');


INSERT INTO salas (nome, capacidade, localizacao, descricao) VALUES
    ('Sala A',               10, 'Piso 1 - Ala Norte', 'Sala de reuniões pequenas com projetor'),
    ('Sala B',               20, 'Piso 1 - Ala Sul',   'Sala de reuniões médias com TV e quadro'),
    ('Sala de Conferencias', 50, 'Piso 2',              'Sala principal para grandes reuniões'),
    ('Sala de Formacao',     30, 'Piso 3',              'Sala com computadores para formações'),
    ('Sala Executiva',        8, 'Piso 2 - Ala Norte', 'Sala reservada para reuniões de direção');


INSERT INTO reservas (id_usuario, id_sala, data_inicio, data_fim, descricao, status) VALUES
    (2, 1, '2026-06-10 09:00:00', '2026-06-10 10:00:00', 'Reunião de equipa semanal',    'ativa'),
    (3, 2, '2026-06-10 14:00:00', '2026-06-10 16:00:00', 'Apresentação de projeto',      'ativa'),
    (4, 3, '2026-06-11 10:00:00', '2026-06-11 12:00:00', 'Conferência de departamentos', 'ativa'),
    (5, 4, '2026-06-12 08:00:00', '2026-06-12 17:00:00', 'Formação em Excel avançado',   'ativa'),
    (2, 5, '2026-06-13 15:00:00', '2026-06-13 16:30:00', 'Reunião com direção',          'cancelada');

