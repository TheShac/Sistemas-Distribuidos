-- 1. Crear la tabla de Pedidos si no existe
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    nombre_enfermero VARCHAR(100) NOT NULL, -- Ahora es un string para el nombre directo
    insumo_solicitado VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL,
    estado VARCHAR(50) DEFAULT 'PENDIENTE', -- PENDIENTE, EN_PROCESO, COMPLETADO, RECHAZADO
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insertar datos de prueba iniciales con nombres reales
INSERT INTO pedidos (nombre_enfermero, insumo_solicitado, cantidad, estado) 
VALUES 
    ('Brayan Silva', 'Tanque de Oxigeno', 3, 'PENDIENTE'),
    ('Andrea Toledo', 'Mascarillas KN95', 50, 'PENDIENTE'),
    ('Carlos Mendoza', 'Guantes Quirurgicos', 200, 'COMPLETADO');