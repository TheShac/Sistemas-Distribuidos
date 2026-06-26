-- 1. Tabla para el stock físico disponible en las bodegas
CREATE TABLE IF NOT EXISTS stock (
    insumo_id SERIAL PRIMARY KEY,
    nombre_insumo VARCHAR(100) NOT NULL,
    cantidad_disponible INT NOT NULL
);

-- 2. Tabla para guardar las reservas de insumos gatilladas por los eventos
CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    pedido_id INT NOT NULL,              -- ID del pedido que viene desde la BD de Pedidos
    nombre_insumo VARCHAR(100) NOT NULL,
    cantidad_reservada INT NOT NULL,
    estado VARCHAR(50) DEFAULT 'RESERVADO', -- RESERVADO, PROCESADO, CANCELADO
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Insertar insumos médicos iniciales de prueba (Stock de la bodega)
INSERT INTO stock (nombre_insumo, cantidad_disponible) 
VALUES 
    ('Tanque de Oxigeno', 50),
    ('Mascarillas KN95', 500),
    ('Guantes Quirurgicos', 1000);

-- 4. Insertar una reserva de prueba para simular que ya hay un flujo corriendo
INSERT INTO reservas (pedido_id, nombre_insumo, cantidad_reservada, estado)
VALUES (3, 'Guantes Quirurgicos', 200, 'PROCESADO');