-- ============================================================================
--  ISTMO PROPIEDADES · Datos de ejemplo (opcional)
--  Ejecutar DESPUÉS de schema.sql, en el SQL Editor de Supabase.
--
--  Son propiedades de demostración con fotos de Unsplash (licencia libre
--  para uso comercial). Puedes borrarlas desde el panel o con:
--     delete from public.properties where seller_id is null;
-- ============================================================================

insert into public.properties (
  slug, title, description, price, currency,
  province, district, neighborhood,
  transaction_type, property_type,
  bedrooms, bathrooms, parking_spots, area_m2,
  amenities, is_furnished, images, latitude, longitude,
  status, is_featured, created_at
)
values
(
  'villa-moderna-con-piscina-en-punta-pacifica',
  'Villa moderna con piscina en Punta Pacífica',
  E'Villa de arquitectura contemporánea en una de las zonas más exclusivas de Ciudad de Panamá. Doble altura, ventanales de piso a techo y una terraza privada con piscina que invita a disfrutar del clima tropical todo el año.\n\nLa planta principal integra sala, comedor y cocina abierta con isla central, ideal para recibir. Arriba, la suite principal cuenta con vestidor, baño en mármol y balcón con vista a la ciudad. Incluye cuarto de servicio independiente y estacionamiento techado para dos vehículos.\n\nA minutos de restaurantes, colegios internacionales, hospitales y del corredor Sur.',
  1250000, 'USD',
  'Panamá', 'Panamá', 'Punta Pacífica',
  'Venta', 'Casas',
  4, 4, 2, 420,
  array['Piscina','Terraza','Jardín','Aire acondicionado','Cocina equipada','Cuarto de servicio','Sistema de seguridad','Portón automático'],
  false,
  array[
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=75',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=75',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=75'
  ],
  8.9800, -79.5100,
  'published', true, now() - interval '2 days'
),
(
  'apartamento-con-vista-al-mar-en-costa-del-este',
  'Apartamento con vista al mar en Costa del Este',
  E'Apartamento luminoso en torre de lujo con vista abierta al océano y a la bahía. Acabados de primera, pisos de porcelanato y ventanales corredizos que conectan la sala con un amplio balcón.\n\nEl edificio ofrece piscina, gimnasio, salón social, área de coworking y seguridad 24/7. Incluye dos estacionamientos y depósito.\n\nUna ubicación privilegiada para vivir cerca de oficinas, colegios y la vía costera.',
  650000, 'USD',
  'Panamá', 'Panamá', 'Costa del Este',
  'Venta', 'Apartamentos',
  3, 3, 2, 210,
  array['Piscina','Gimnasio','Balcón','Aire acondicionado','Closets empotrados','Sistema de seguridad','Área social','Vista al mar'],
  false,
  array[
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=75',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=75',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=75'
  ],
  9.0050, -79.4750,
  'published', true, now() - interval '5 days'
),
(
  'casa-de-campo-en-boquete-con-vista-al-volcan',
  'Casa de campo en Boquete con vista al volcán',
  E'Casa de montaña rodeada de jardines y cafetales, con vista directa al volcán Barú. Techos altos de madera, chimenea y un gran ventanal que enmarca el paisaje.\n\nTres habitaciones con baño propio, cocina equipada, área de lavandería y una terraza cubierta para desayunar frente a la montaña. El terreno incluye árboles frutales y espacio para huerto.\n\nA pocos minutos del centro de Boquete, restaurantes y senderos.',
  485000, 'USD',
  'Chiriquí', 'Boquete', 'Jaramillo',
  'Venta', 'Casas',
  3, 3, 2, 280,
  array['Terraza','Jardín','Chimenea','Cocina equipada','Lavandería','Vista a la montaña','Cerca perimetral','Agua potable'],
  true,
  array[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=75',
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1600&q=75',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=75'
  ],
  8.7800, -82.4300,
  'published', true, now() - interval '9 days'
),
(
  'terreno-con-vista-en-tierras-altas',
  'Terreno con vista en Tierras Altas',
  E'Terreno de 5,000 m² en zona de clima fresco, con vista panorámica a las montañas y acceso por camino lastrado en buen estado.\n\nIdeal para casa de campo, proyecto de cabañas o cultivo. Cuenta con agua y electricidad en el linde. La topografía es suavemente ondulada y permite varias terrazas de construcción.\n\nA 20 minutos de Volcán y a una hora de David.',
  220000, 'USD',
  'Chiriquí', 'Tierras Altas', 'Cerro Punta',
  'Venta', 'Lotes y Terrenos',
  null, null, null, 5000,
  array['Vista a la montaña','Área verde','Agua potable','Acceso por camino'],
  false,
  array[
    'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=75',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=75'
  ],
  8.8500, -82.5700,
  'published', false, now() - interval '14 days'
),
(
  'finca-productiva-en-penonome',
  'Finca productiva en Penonomé',
  E'Finca de 5.2 hectáreas con tierras fértiles y acceso a carretera pavimentada. Actualmente produce cítricos y pasto mejorado, con cerca eléctrica y corral para ganado menor.\n\nIncluye casa de campo de tres habitaciones, bodega, pozo y sistema de riego. El terreno es plano en un 80 %, lo que facilita la mecanización y futuras ampliaciones.\n\nA 15 minutos del centro de Penonomé y con fácil salida a la Interamericana.',
  390000, 'USD',
  'Coclé', 'Penonomé', 'El Coco',
  'Venta', 'Fincas',
  3, 2, 4, 52000,
  array['Cerca perimetral','Pozo de agua','Sistema de riego','Bodega','Área verde','Acceso por camino'],
  false,
  array[
    'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1600&q=75',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=75'
  ],
  8.5200, -80.3600,
  'published', false, now() - interval '20 days'
),
(
  'apartamento-amueblado-en-albrook',
  'Apartamento amueblado en Albrook',
  E'Apartamento completamente amueblado y equipado, listo para mudarse. Dos habitaciones, balcón con vista a las áreas verdes y un layout muy eficiente.\n\nEl edificio cuenta con piscina, gimnasio y seguridad 24/7. Cerca de Albrook Mall, terminal de transporte, supermercados y oficinas públicas.\n\nDisponible para alquiler anual. Incluye agua, mantenimiento y un estacionamiento.',
  1450, 'USD',
  'Panamá', 'Panamá', 'Albrook',
  'Alquiler', 'Apartamentos',
  2, 2, 1, 95,
  array['Amueblado','Piscina','Gimnasio','Balcón','Aire acondicionado','Lavandería','Sistema de seguridad','Área social'],
  true,
  array[
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=75',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=75',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=75'
  ],
  8.9750, -79.5550,
  'published', false, now() - interval '3 days'
),
(
  'local-comercial-en-via-espana',
  'Local comercial en Vía España',
  E'Local en planta baja con vitrina amplia y excelente flujo peatonal sobre Vía España. Espacio diáfano de 180 m², baño privado, cuarto de depósito y dos estacionamientos.\n\nApto para tienda, clínica, cafetería o showroom. Cuenta con aire acondicionado central y acometida eléctrica trifásica.\n\nDisponible para alquiler inmediato.',
  2800, 'USD',
  'Panamá', 'Panamá', 'Vía España',
  'Alquiler', 'Locales comerciales y bodegas',
  null, 2, 2, 180,
  array['Vitrina','Aire acondicionado central','Depósito','Estacionamiento de visitantes','Seguridad 24/7','Cableado estructurado'],
  false,
  array[
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=75',
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1600&q=75'
  ],
  8.9900, -79.5150,
  'published', false, now() - interval '6 days'
),
(
  'casa-frente-al-mar-en-coronado',
  'Casa frente al mar en Coronado',
  E'Casa familiar a pocos pasos de la playa, dentro de comunidad privada con acceso controlado. Amplia sala con salida a la terraza y piscina, ideal para reuniones.\n\nCuatro habitaciones, todas con aire acondicionado, cocina remodelada y cuarto de servicio. El jardín tiene riego automático y áreas verdes consolidadas.\n\nA una hora de Ciudad de Panamá por la Interamericana, cerca de supermercados, colegios y restaurantes.',
  795000, 'USD',
  'Panamá Oeste', 'Chame', 'Coronado',
  'Venta', 'Propiedades de playa',
  4, 4, 3, 350,
  array['Piscina','Acceso a playa','Terraza','Jardín','Aire acondicionado','Cocina equipada','Cuarto de servicio','Seguridad 24/7','Portón automático'],
  false,
  array[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=75',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=75',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=75'
  ],
  8.5600, -79.8900,
  'published', true, now() - interval '11 days'
),
(
  'oficina-premium-en-calle-50',
  'Oficina premium en Calle 50',
  E'Oficina esquinera en piso alto de torre corporativa, con vista despejada y excelente iluminación natural. Recibidor, sala de reuniones, dos oficinas privadas y área abierta para seis estaciones de trabajo.\n\nEl edificio ofrece lobby atendido, seguridad 24/7, generador de respaldo y dos estacionamientos asignados. Cableado estructurado y aire acondicionado central incluidos.\n\nDisponible para alquiler anual.',
  3200, 'USD',
  'Panamá', 'Panamá', 'Calle 50',
  'Alquiler', 'Oficinas',
  null, 2, 2, 160,
  array['Recepción','Oficina privada','Sala de reuniones','Aire acondicionado central','Cableado estructurado','Seguridad 24/7','Planta eléctrica','Estacionamiento de visitantes'],
  false,
  array[
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=75',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=75'
  ],
  8.9850, -79.5200,
  'published', false, now() - interval '17 days'
),
(
  'casa-familiar-en-david',
  'Casa familiar en David',
  E'Casa de dos plantas en barrio residencial tranquilo, con patio amplio y árboles frutales. Sala y comedor separados, cocina con desayunador y tres habitaciones cómodas.\n\nTiene portón automático, estacionamiento para dos autos y espacio para ampliar. Cerca de colegios, hospitales y del centro de David.\n\nIdeal para familia que busca tranquilidad sin alejarse de la ciudad.',
  235000, 'USD',
  'Chiriquí', 'David', 'Las Lomas',
  'Venta', 'Casas',
  3, 2, 2, 190,
  array['Jardín','Patio','Aire acondicionado','Closets empotrados','Lavandería','Portón automático','Cerca perimetral'],
  false,
  array[
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=75',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=75'
  ],
  8.4300, -82.4300,
  'published', false, now() - interval '25 days'
),
(
  'proyecto-de-apartamentos-en-san-francisco',
  'Proyecto de apartamentos en San Francisco',
  E'Borrador de demostración: preventa de apartamentos de dos y tres habitaciones en San Francisco, con entrega estimada para el próximo año.\n\nPendiente de cargar planos, precios por tipología y fotos de la maqueta. Esta propiedad no aparece en el sitio público porque su estado es "draft".',
  285000, 'USD',
  'Panamá', 'Panamá', 'San Francisco',
  'Venta', 'Apartamentos',
  2, 2, 1, 110,
  array['Piscina','Gimnasio','Área social','Balcón','Sistema de seguridad'],
  false,
  array[
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=75'
  ],
  8.9900, -79.5050,
  'draft', false, now() - interval '1 day'
)
on conflict (slug) do nothing;
