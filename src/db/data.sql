DELETE FROM stars;
INSERT INTO stars
  (index, cluster, name)
VALUES
  (1, 1, 'Sol')
, (2, 1, 'Proxima Centauri')
, (3, 1, 'Alpha Centauri A')
, (4, 1, 'Bernard''s Star')
, (1, 2, 'Luhman 16')
, (2, 2, 'Wolf 359')
, (3, 2, 'Lalande 21185')
, (4, 2, 'Sirius A')
, (5, 2, 'Luyten 726-8 A')
, (1, 3, 'V1216 Sagittarii')
, (2, 3, 'HH Andromedae')
, (3, 3, 'Epsilon Eridani')
, (4, 3, 'Lacaille 9352')
, (1, 4, 'FI Virginis')
, (2, 4, 'EZ Aquarii')
, (3, 4, '61 Cygni B')
, (1, 5, 'Procyon A')
, (2, 5, 'Struve 2398 B')
, (1, 6, 'Groombridge 34 B')
, (2, 6, 'DX Cancri')
, (3, 6, 'Tau Ceti')
;

DELETE FROM planets;
INSERT INTO planets
  (index, star_id, name, ruler, asteroid_m, asteroid_c, asteroid_r)
VALUES
  (1, 1, 'Earth', 'President', 3, 0, 0)
, (1, 2, 'Solaris', 'King', 2, 0, 0)
, (1, 3, 'Arrakis', 'Muad''Dib', 5, 0, 0)
, (1, 4, 'Ego', 'King', 3, 0, 0)
, (1, 5, 'Krypton', 'King', 2, 0, 0)
, (1, 6, 'Dagobah', 'King', 2, 1, 3)
, (1, 7, 'Geidi Prime', 'Baron', 3, 0, 0)
;

DELETE FROM fleets;
INSERT INTO fleets
  (id, index, planet_id, name)
VALUES
  ('1', '1', '1', '1st Earth fleet')
;

DELETE FROM squadrons;
INSERT INTO squadrons
  (id, index, fleet_id, name)
VALUES
  (1, 1, 1, '25th Stealth Battleships')
;

DELETE FROM trait_types;
INSERT INTO trait_types
  (id, name)
VALUES
  (1, 'battleship')
;


DELETE FROM traits;
INSERT INTO traits
  (id, squadron_id)
VALUES
  (1, 1)
;
