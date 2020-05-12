 SELECT f.name,
    f.is_attacking,
    (f.state = 2) AS is_warping,
    f.target_id
   FROM fleets f;
