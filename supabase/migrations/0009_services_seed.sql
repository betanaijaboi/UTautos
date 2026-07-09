insert into public.services (type, name, description, price_cents, duration_minutes, is_express, sort_order) values
('car', 'Body Wash & Dry', 'Hand wash, foam bath, microfiber dry — exterior only.', 8000, 45, false, 1),
('car', 'Interior Deep Clean', 'Vacuum, upholstery shampoo, dash and console detail.', 12000, 90, false, 2),
('car', 'Engine Bay Detail', 'Degrease, dress, and detail the engine compartment.', 9000, 60, false, 3),
('car', 'Polishing & Ceramic Coating', 'Machine polish, paint correction, and ceramic sealant.', 35000, 240, false, 4),
('car', 'Full Detail', 'Complete interior + exterior + engine bay + ceramic coat.', 55000, 360, false, 5),
('car', 'Express Detail (Phone-Only Booking)', 'Priority mobile detailing within a 5-hour window. Call to book.', 75000, 90, true, 6);

insert into public.services (type, name, description, price_cents, duration_minutes, is_express, sort_order) values
('jet', 'Hull Wash', 'Exterior fuselage hand wash and dry.', 150000, 120, false, 1),
('jet', 'Cabin Deep Clean', 'Full interior detail: seats, carpets, galley, lavatory.', 180000, 150, false, 2),
('jet', 'Polishing & Coating', 'Machine polish and protective coating for the fuselage.', 320000, 300, false, 3),
('jet', 'Full Detail', 'Complete hull, cabin, and polishing service.', 550000, 480, false, 4),
('jet', 'Express Detail (Phone-Only Booking)', 'Priority mobile detailing within a 5-hour window. Call to book.', 650000, 180, true, 5);
