DELETE FROM stars;
INSERT INTO stars
  (id, index, cluster, name)
VALUES
  ('1', '1', '1', 'Wolf 359')
, ('2', '2', '2', 'Sol')
;

DELETE FROM planets;
INSERT INTO planets
  (id, index, star_id, name, ruler)
VALUES
  ('1', '1', '1', 'Geidi Prime', 'Baron')
, ('2', '2', '2', 'Earth', 'Mr President')
;

DELETE FROM fleets;
INSERT INTO fleets
  (id, index, planet_id, name)
VALUES
  ('1', '1', '1', '25th Lasers')
;
