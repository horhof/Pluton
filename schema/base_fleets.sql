DROP VIEW base_fleets;
CREATE VIEW base_fleets AS
SELECT
  f.id
, f.name
, f.index
, f.planet_id
, f.ships
FROM fleets AS f
LEFT JOIN planets AS p
  ON p.id = f.planet_id
WHERE TRUE
  AND f.is_base IS TRUE;
