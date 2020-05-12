 SELECT p.id,
    p.name,
    p.index,
    p.star_id,
    s.cluster AS cluster_no,
    s.index AS star_no,
    p.index AS planet_no,
    ((((s.cluster || ':'::text) || s.index) || ':'::text) || p.index) AS coords
   FROM (planets p
     LEFT JOIN stars s ON ((s.id = p.star_id)));
