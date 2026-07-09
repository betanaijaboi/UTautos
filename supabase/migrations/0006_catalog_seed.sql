-- Car brands
insert into public.catalog_brands (type, name, slug, monogram, hero_style, sort_order) values
('car', 'Ferrari', 'ferrari', 'F', '{"from":"#3d0303","to":"#0a0000","accent":"#ff3b3b"}', 1),
('car', 'Lamborghini', 'lamborghini', 'L', '{"from":"#0f1f0a","to":"#050805","accent":"#b4ff39"}', 2),
('car', 'Rolls-Royce', 'rolls-royce', 'RR', '{"from":"#0d1420","to":"#05070c","accent":"#c9d3e0"}', 3),
('car', 'Bentley', 'bentley', 'B', '{"from":"#0f1f16","to":"#060b08","accent":"#c9a15a"}', 4),
('car', 'Porsche', 'porsche', 'P', '{"from":"#4a0508","to":"#0a0000","accent":"#e2b13c"}', 5),
('car', 'McLaren', 'mclaren', 'Mc', '{"from":"#3d1400","to":"#0a0400","accent":"#ff8000"}', 6),
('car', 'Aston Martin', 'aston-martin', 'AM', '{"from":"#04140d","to":"#020a06","accent":"#6bbf8e"}', 7),
('car', 'Mercedes-Maybach', 'mercedes-maybach', 'MB', '{"from":"#1a1610","to":"#080705","accent":"#d4c294"}', 8);

-- Jet brands
insert into public.catalog_brands (type, name, slug, monogram, hero_style, sort_order) values
('jet', 'Gulfstream', 'gulfstream', 'G', '{"from":"#0a1620","to":"#04080c","accent":"#7fa8c9"}', 1),
('jet', 'Bombardier', 'bombardier', 'BD', '{"from":"#1f0a0d","to":"#0a0304","accent":"#c9484f"}', 2),
('jet', 'Cessna Citation', 'cessna-citation', 'CC', '{"from":"#0a1420","to":"#04070c","accent":"#9fb4cc"}', 3),
('jet', 'Embraer', 'embraer', 'E', '{"from":"#05191a","to":"#020a0a","accent":"#4fd1c5"}', 4),
('jet', 'Dassault Falcon', 'dassault-falcon', 'DF', '{"from":"#12100a","to":"#080704","accent":"#c9a15a"}', 5);

-- Ferrari
insert into public.catalog_models (brand_id, type, name, slug, model_year_range, tagline, specs, sort_order)
select id, 'car', m.name, m.slug, m.years, m.tagline, m.specs::jsonb, m.sort_order
from public.catalog_brands b, (values
  ('SF90 Stradale', 'ferrari-sf90-stradale', '2024-2026', 'Ferrari''s first series-production hybrid supercar.', '{"0-60":"2.5s","topSpeed":"211 mph","power":"986 hp"}', 1),
  ('296 GTB', 'ferrari-296-gtb', '2024-2026', 'V6 hybrid, mid-engine, razor-sharp.', '{"0-60":"2.9s","topSpeed":"205 mph","power":"819 hp"}', 2),
  ('296 GTS', 'ferrari-296-gts', '2024-2026', 'The 296 GTB, open to the sky.', '{"0-60":"2.9s","topSpeed":"205 mph","power":"819 hp"}', 3),
  ('Roma', 'ferrari-roma', '2024-2026', 'Grand touring elegance, front-engine V8.', '{"0-60":"3.4s","topSpeed":"199 mph","power":"612 hp"}', 4),
  ('Purosangue', 'ferrari-purosangue', '2024-2026', 'Ferrari''s first four-door, four-seat FUV.', '{"0-60":"3.3s","topSpeed":"193 mph","power":"715 hp"}', 5),
  ('12Cilindri', 'ferrari-12cilindri', '2025-2026', 'Naturally aspirated V12 grand tourer.', '{"0-60":"2.9s","topSpeed":"211 mph","power":"819 hp"}', 6),
  ('F8 Tributo', 'ferrari-f8-tributo', '2023-2024', 'A tribute to the most powerful V8 in Ferrari history.', '{"0-60":"2.9s","topSpeed":"211 mph","power":"710 hp"}', 7)
) as m(name, slug, years, tagline, specs, sort_order)
where b.slug = 'ferrari';

-- Lamborghini
insert into public.catalog_models (brand_id, type, name, slug, model_year_range, tagline, specs, sort_order)
select id, 'car', m.name, m.slug, m.years, m.tagline, m.specs::jsonb, m.sort_order
from public.catalog_brands b, (values
  ('Revuelto', 'lamborghini-revuelto', '2024-2026', 'V12 hybrid flagship, the new benchmark.', '{"0-60":"2.5s","topSpeed":"217 mph","power":"1001 hp"}', 1),
  ('Temerario', 'lamborghini-temerario', '2025-2026', 'Twin-turbo V8 hybrid, successor to the Huracán.', '{"0-60":"2.7s","topSpeed":"213 mph","power":"907 hp"}', 2),
  ('Huracán STO', 'lamborghini-huracan-sto', '2023-2024', 'Super Trofeo Omologata — race car for the road.', '{"0-60":"3.0s","topSpeed":"192 mph","power":"631 hp"}', 3),
  ('Huracán Tecnica', 'lamborghini-huracan-tecnica', '2023-2024', 'Rear-wheel-drive purity, track-honed.', '{"0-60":"3.2s","topSpeed":"202 mph","power":"631 hp"}', 4),
  ('Urus SE', 'lamborghini-urus-se', '2025-2026', 'Plug-in hybrid Super SUV.', '{"0-60":"3.4s","topSpeed":"194 mph","power":"789 hp"}', 5),
  ('Urus Performante', 'lamborghini-urus-performante', '2023-2024', 'The lightest, most track-focused Urus.', '{"0-60":"3.3s","topSpeed":"190 mph","power":"657 hp"}', 6)
) as m(name, slug, years, tagline, specs, sort_order)
where b.slug = 'lamborghini';

-- Rolls-Royce
insert into public.catalog_models (brand_id, type, name, slug, model_year_range, tagline, specs, sort_order)
select id, 'car', m.name, m.slug, m.years, m.tagline, m.specs::jsonb, m.sort_order
from public.catalog_brands b, (values
  ('Phantom', 'rolls-royce-phantom', '2024-2026', 'The pinnacle of motor car luxury.', '{"0-60":"5.1s","topSpeed":"155 mph","power":"563 hp"}', 1),
  ('Ghost', 'rolls-royce-ghost', '2024-2026', 'Effortless, understated, post-opulent.', '{"0-60":"4.6s","topSpeed":"155 mph","power":"563 hp"}', 2),
  ('Cullinan', 'rolls-royce-cullinan', '2024-2026', 'The SUV that redefined the category.', '{"0-60":"4.9s","topSpeed":"155 mph","power":"563 hp"}', 3),
  ('Spectre', 'rolls-royce-spectre', '2024-2026', 'The first all-electric Rolls-Royce.', '{"0-60":"4.4s","topSpeed":"155 mph","power":"577 hp"}', 4),
  ('Cullinan Black Badge', 'rolls-royce-cullinan-black-badge', '2024-2026', 'Cullinan, after dark.', '{"0-60":"4.8s","topSpeed":"155 mph","power":"592 hp"}', 5),
  ('Ghost Black Badge', 'rolls-royce-ghost-black-badge', '2024-2026', 'Ghost, unleashed.', '{"0-60":"4.5s","topSpeed":"155 mph","power":"592 hp"}', 6)
) as m(name, slug, years, tagline, specs, sort_order)
where b.slug = 'rolls-royce';

-- Bentley
insert into public.catalog_models (brand_id, type, name, slug, model_year_range, tagline, specs, sort_order)
select id, 'car', m.name, m.slug, m.years, m.tagline, m.specs::jsonb, m.sort_order
from public.catalog_brands b, (values
  ('Continental GT', 'bentley-continental-gt', '2024-2026', 'The definitive grand tourer.', '{"0-60":"3.3s","topSpeed":"208 mph","power":"657 hp"}', 1),
  ('Continental GTC', 'bentley-continental-gtc', '2024-2026', 'Continental GT, convertible.', '{"0-60":"3.5s","topSpeed":"198 mph","power":"657 hp"}', 2),
  ('Flying Spur', 'bentley-flying-spur', '2024-2026', 'A grand tourer with four doors.', '{"0-60":"3.5s","topSpeed":"207 mph","power":"657 hp"}', 3),
  ('Bentayga', 'bentley-bentayga', '2024-2026', 'The benchmark luxury SUV.', '{"0-60":"3.8s","topSpeed":"193 mph","power":"542 hp"}', 4),
  ('Bentayga EWB', 'bentley-bentayga-ewb', '2024-2026', 'Extended wheelbase, extended presence.', '{"0-60":"4.5s","topSpeed":"180 mph","power":"542 hp"}', 5),
  ('Batur', 'bentley-batur', '2023-2024', 'Mulliner coachbuilt, strictly limited.', '{"0-60":"3.4s","topSpeed":"209 mph","power":"730 hp"}', 6)
) as m(name, slug, years, tagline, specs, sort_order)
where b.slug = 'bentley';

-- Porsche
insert into public.catalog_models (brand_id, type, name, slug, model_year_range, tagline, specs, sort_order)
select id, 'car', m.name, m.slug, m.years, m.tagline, m.specs::jsonb, m.sort_order
from public.catalog_brands b, (values
  ('911 Turbo S', 'porsche-911-turbo-s', '2024-2026', 'All-wheel-drive fury, everyday usable.', '{"0-60":"2.6s","topSpeed":"205 mph","power":"640 hp"}', 1),
  ('911 GT3', 'porsche-911-gt3', '2024-2026', 'Motorsport, homologated for the street.', '{"0-60":"3.2s","topSpeed":"197 mph","power":"502 hp"}', 2),
  ('911 Carrera S', 'porsche-911-carrera-s', '2024-2026', 'The reference sports car.', '{"0-60":"3.3s","topSpeed":"191 mph","power":"473 hp"}', 3),
  ('Taycan Turbo S', 'porsche-taycan-turbo-s', '2024-2026', 'Electric performance, redefined.', '{"0-60":"2.4s","topSpeed":"161 mph","power":"751 hp"}', 4),
  ('Panamera Turbo S E-Hybrid', 'porsche-panamera-turbo-s-e-hybrid', '2024-2026', 'A sports car for four.', '{"0-60":"2.9s","topSpeed":"196 mph","power":"782 hp"}', 5),
  ('Cayenne Turbo GT', 'porsche-cayenne-turbo-gt', '2024-2025', 'The fastest SUV around the Ring, once.', '{"0-60":"3.1s","topSpeed":"186 mph","power":"631 hp"}', 6),
  ('718 Cayman GT4 RS', 'porsche-718-cayman-gt4-rs', '2023-2024', 'Naturally aspirated, mid-engine, uncompromising.', '{"0-60":"3.2s","topSpeed":"196 mph","power":"493 hp"}', 7)
) as m(name, slug, years, tagline, specs, sort_order)
where b.slug = 'porsche';

-- McLaren
insert into public.catalog_models (brand_id, type, name, slug, model_year_range, tagline, specs, sort_order)
select id, 'car', m.name, m.slug, m.years, m.tagline, m.specs::jsonb, m.sort_order
from public.catalog_brands b, (values
  ('750S', 'mclaren-750s', '2024-2026', 'The most engaging McLaren supercar yet.', '{"0-60":"2.7s","topSpeed":"206 mph","power":"740 hp"}', 1),
  ('750S Spider', 'mclaren-750s-spider', '2024-2026', '750S, open-top.', '{"0-60":"2.8s","topSpeed":"203 mph","power":"740 hp"}', 2),
  ('Artura', 'mclaren-artura', '2024-2026', 'McLaren''s first series-production hybrid.', '{"0-60":"2.8s","topSpeed":"205 mph","power":"690 hp"}', 3),
  ('GTS', 'mclaren-gts', '2024-2026', 'Grand touring, McLaren style.', '{"0-60":"3.1s","topSpeed":"203 mph","power":"635 hp"}', 4),
  ('W1', 'mclaren-w1', '2025-2026', 'Hybrid hypercar, F1-derived aero.', '{"0-60":"2.7s","topSpeed":"217 mph","power":"1258 hp"}', 5)
) as m(name, slug, years, tagline, specs, sort_order)
where b.slug = 'mclaren';

-- Aston Martin
insert into public.catalog_models (brand_id, type, name, slug, model_year_range, tagline, specs, sort_order)
select id, 'car', m.name, m.slug, m.years, m.tagline, m.specs::jsonb, m.sort_order
from public.catalog_brands b, (values
  ('DB12', 'aston-martin-db12', '2024-2026', 'The first Super Tourer.', '{"0-60":"3.5s","topSpeed":"202 mph","power":"671 hp"}', 1),
  ('DB12 Volante', 'aston-martin-db12-volante', '2024-2026', 'DB12, open-air.', '{"0-60":"3.6s","topSpeed":"202 mph","power":"671 hp"}', 2),
  ('Vantage', 'aston-martin-vantage', '2024-2026', 'The purist''s Aston Martin.', '{"0-60":"3.4s","topSpeed":"202 mph","power":"656 hp"}', 3),
  ('DBX707', 'aston-martin-dbx707', '2024-2026', 'The most powerful luxury SUV on sale.', '{"0-60":"3.1s","topSpeed":"193 mph","power":"697 hp"}', 4),
  ('Vanquish', 'aston-martin-vanquish', '2025-2026', 'The flagship, reborn with a V12.', '{"0-60":"3.3s","topSpeed":"214 mph","power":"824 hp"}', 5)
) as m(name, slug, years, tagline, specs, sort_order)
where b.slug = 'aston-martin';

-- Mercedes-Maybach
insert into public.catalog_models (brand_id, type, name, slug, model_year_range, tagline, specs, sort_order)
select id, 'car', m.name, m.slug, m.years, m.tagline, m.specs::jsonb, m.sort_order
from public.catalog_brands b, (values
  ('Maybach S 680', 'maybach-s-680', '2024-2026', 'Chauffeur-driven perfection.', '{"0-60":"4.4s","topSpeed":"155 mph","power":"621 hp"}', 1),
  ('Maybach GLS 600', 'maybach-gls-600', '2024-2026', 'First-class, off the beaten path.', '{"0-60":"4.9s","topSpeed":"143 mph","power":"550 hp"}', 2),
  ('Maybach EQS 680 SUV', 'maybach-eqs-680-suv', '2024-2026', 'Electric, effortless, opulent.', '{"0-60":"4.5s","topSpeed":"130 mph","power":"649 hp"}', 3),
  ('Maybach S 580', 'maybach-s-580', '2024-2026', 'The quieter, no less lavish, flagship.', '{"0-60":"4.9s","topSpeed":"130 mph","power":"496 hp"}', 4)
) as m(name, slug, years, tagline, specs, sort_order)
where b.slug = 'mercedes-maybach';

-- Gulfstream
insert into public.catalog_models (brand_id, type, name, slug, model_year_range, tagline, specs, sort_order)
select id, 'jet', m.name, m.slug, m.years, m.tagline, m.specs::jsonb, m.sort_order
from public.catalog_brands b, (values
  ('G700', 'gulfstream-g700', '2024-2026', 'The largest, most spacious Gulfstream cabin.', '{"range":"7750 nm","seats":"19","topSpeed":"Mach 0.935"}', 1),
  ('G800', 'gulfstream-g800', '2024-2026', 'Ultra-long-range, ultra-efficient.', '{"range":"8000 nm","seats":"19","topSpeed":"Mach 0.935"}', 2),
  ('G650ER', 'gulfstream-g650er', '2023-2025', 'The aircraft that redefined business aviation.', '{"range":"7500 nm","seats":"19","topSpeed":"Mach 0.925"}', 3),
  ('G500', 'gulfstream-g500', '2024-2026', 'Speed and range in a mid-size cabin.', '{"range":"5300 nm","seats":"19","topSpeed":"Mach 0.925"}', 4),
  ('G280', 'gulfstream-g280', '2024-2026', 'The benchmark super mid-size jet.', '{"range":"3600 nm","seats":"10","topSpeed":"Mach 0.85"}', 5)
) as m(name, slug, years, tagline, specs, sort_order)
where b.slug = 'gulfstream';

-- Bombardier
insert into public.catalog_models (brand_id, type, name, slug, model_year_range, tagline, specs, sort_order)
select id, 'jet', m.name, m.slug, m.years, m.tagline, m.specs::jsonb, m.sort_order
from public.catalog_brands b, (values
  ('Global 7500', 'bombardier-global-7500', '2024-2026', 'The largest, longest-range business jet.', '{"range":"7700 nm","seats":"19","topSpeed":"Mach 0.925"}', 1),
  ('Global 8000', 'bombardier-global-8000', '2025-2026', 'The fastest civil aircraft, Mach 0.94.', '{"range":"8000 nm","seats":"19","topSpeed":"Mach 0.94"}', 2),
  ('Challenger 3500', 'bombardier-challenger-3500', '2024-2026', 'The best-selling super mid-size jet.', '{"range":"3400 nm","seats":"10","topSpeed":"Mach 0.83"}', 3),
  ('Challenger 650', 'bombardier-challenger-650', '2023-2024', 'Wide-body comfort, proven reliability.', '{"range":"4000 nm","seats":"12","topSpeed":"Mach 0.83"}', 4)
) as m(name, slug, years, tagline, specs, sort_order)
where b.slug = 'bombardier';

-- Cessna Citation (Textron Aviation)
insert into public.catalog_models (brand_id, type, name, slug, model_year_range, tagline, specs, sort_order)
select id, 'jet', m.name, m.slug, m.years, m.tagline, m.specs::jsonb, m.sort_order
from public.catalog_brands b, (values
  ('Citation Longitude', 'citation-longitude', '2024-2026', 'Super mid-size range, business-jet quiet.', '{"range":"3500 nm","seats":"12","topSpeed":"Mach 0.84"}', 1),
  ('Citation Latitude', 'citation-latitude', '2024-2026', 'The best-selling mid-size jet.', '{"range":"2850 nm","seats":"9","topSpeed":"Mach 0.80"}', 2),
  ('Citation X+', 'citation-x-plus', '2023-2024', 'The fastest civilian aircraft in production.', '{"range":"3460 nm","seats":"12","topSpeed":"Mach 0.935"}', 3),
  ('Citation Sovereign+', 'citation-sovereign-plus', '2023-2024', 'Mid-size comfort, short-field capability.', '{"range":"3200 nm","seats":"12","topSpeed":"Mach 0.83"}', 4)
) as m(name, slug, years, tagline, specs, sort_order)
where b.slug = 'cessna-citation';

-- Embraer
insert into public.catalog_models (brand_id, type, name, slug, model_year_range, tagline, specs, sort_order)
select id, 'jet', m.name, m.slug, m.years, m.tagline, m.specs::jsonb, m.sort_order
from public.catalog_brands b, (values
  ('Praetor 600', 'embraer-praetor-600', '2024-2026', 'The farthest-flying super mid-size jet.', '{"range":"4018 nm","seats":"12","topSpeed":"Mach 0.83"}', 1),
  ('Praetor 500', 'embraer-praetor-500', '2024-2026', 'Mid-size range, super mid-size cabin.', '{"range":"3340 nm","seats":"9","topSpeed":"Mach 0.83"}', 2),
  ('Phenom 300E', 'embraer-phenom-300e', '2024-2026', 'The best-selling light jet, a decade running.', '{"range":"2010 nm","seats":"10","topSpeed":"Mach 0.80"}', 3),
  ('Legacy 500', 'embraer-legacy-500', '2023-2024', 'Fly-by-wire, mid-size, full-stand-up cabin.', '{"range":"3125 nm","seats":"12","topSpeed":"Mach 0.83"}', 4)
) as m(name, slug, years, tagline, specs, sort_order)
where b.slug = 'embraer';

-- Dassault Falcon
insert into public.catalog_models (brand_id, type, name, slug, model_year_range, tagline, specs, sort_order)
select id, 'jet', m.name, m.slug, m.years, m.tagline, m.specs::jsonb, m.sort_order
from public.catalog_brands b, (values
  ('Falcon 8X', 'falcon-8x', '2024-2026', 'Three engines, ultra-long-range confidence.', '{"range":"6450 nm","seats":"16","topSpeed":"Mach 0.90"}', 1),
  ('Falcon 6X', 'falcon-6x', '2024-2026', 'The widest cabin cross-section in business aviation.', '{"range":"5500 nm","seats":"16","topSpeed":"Mach 0.90"}', 2),
  ('Falcon 2000LXS', 'falcon-2000lxs', '2023-2024', 'Short-field performance, transcontinental range.', '{"range":"4000 nm","seats":"10","topSpeed":"Mach 0.862"}', 3),
  ('Falcon 900LX', 'falcon-900lx', '2023-2024', 'Tri-jet reliability, intercontinental reach.', '{"range":"4750 nm","seats":"14","topSpeed":"Mach 0.87"}', 4)
) as m(name, slug, years, tagline, specs, sort_order)
where b.slug = 'dassault-falcon';
