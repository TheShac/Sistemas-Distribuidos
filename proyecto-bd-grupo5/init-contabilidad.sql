-- 1. Tabla para registrar el cobro financiero asociado al paciente
CREATE TABLE IF NOT EXISTS cuentas_medicas (
    id SERIAL PRIMARY KEY,
    pedido_id INT NOT NULL,              -- Relación con el pedido original que gatilló el gasto
    nombre_paciente VARCHAR(100) NOT NULL, -- Nombre directo del paciente asignado
    costo_total NUMERIC(10, 2) NOT NULL,  -- Monto en dinero (ej: 45000.50)
    estado_pago VARCHAR(50) DEFAULT 'PENDIENTE', -- PENDIENTE, PAGADO, ANULADO
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insertar un dato de prueba inicial
INSERT INTO cuentas_medicas (pedido_id, nombre_paciente, costo_total, estado_pago)
VALUES (3, 'Juan Perez Gomez', 15000.00, 'PAGADO');