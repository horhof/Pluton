DROP VIEW clusters;
CREATE VIEW clusters AS
SELECT DISTINCT
  stars.cluster
FROM stars
ORDER BY stars.cluster;
