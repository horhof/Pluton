-- Fleets.
CREATE TYPE fleet_state AS ENUM ('home', 'warp', 'arrived', 'return');

CREATE TABLE public.fleets (
    id integer NOT NULL
  , index integer NOT NULL
  , name text NOT NULL
  , is_base boolean DEFAULT false NOT NULL
  , planet_id integer NOT NULL
  , ships integer DEFAULT 0 NOT NULL
  , state fleet_state DEFAULT 'home'
  , is_attacking boolean DEFAULT false NOT NULL
  , target_id integer DEFAULT NULL
  , from_home integer DEFAULT 0 NOT NULL
  , warp_time integer DEFAULT 0 NOT NULL
);

CREATE SEQUENCE public.fleets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.fleets_id_seq OWNED BY public.fleets.id;

-- Planets.
CREATE TABLE public.planets (
    id integer NOT NULL
  , index integer NOT NULL
  , name text NOT NULL
  , ruler text NOT NULL
  , star_id integer NOT NULL
);

CREATE SEQUENCE public.planets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.planets_id_seq OWNED BY public.planets.id;

-- Stars.
CREATE TABLE public.stars (
    id integer NOT NULL,
    index integer NOT NULL,
    cluster integer NOT NULL,
    name text NOT NULL
);

CREATE SEQUENCE public.stars_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.stars_id_seq OWNED BY public.stars.id;

-- Set nextvals.
ALTER TABLE ONLY public.fleets ALTER COLUMN id SET DEFAULT nextval('public.fleets_id_seq'::regclass);

ALTER TABLE ONLY public.planets ALTER COLUMN id SET DEFAULT nextval('public.planets_id_seq'::regclass);

ALTER TABLE ONLY public.stars ALTER COLUMN id SET DEFAULT nextval('public.stars_id_seq'::regclass);

-- Set foreign keys.
ALTER TABLE ONLY public.fleets
    ADD CONSTRAINT fleets_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.planets
    ADD CONSTRAINT planets_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.stars
    ADD CONSTRAINT stars_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fleets
    ADD CONSTRAINT fleets_planet_id_fkey
    FOREIGN KEY (planet_id)
    REFERENCES public.planets(id);

ALTER TABLE ONLY public.fleets
    ADD CONSTRAINT fleets_target_planet_id_fkey
    FOREIGN KEY (target_id)
    REFERENCES public.planets(id);

ALTER TABLE ONLY public.planets
    ADD CONSTRAINT planets_star_id_fkey
    FOREIGN KEY (star_id)
    REFERENCES public.stars(id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT;

-- Clusters.
DROP VIEW clusters;
CREATE VIEW clusters AS
SELECT DISTINCT
  stars.cluster
FROM stars
ORDER BY stars.cluster;
