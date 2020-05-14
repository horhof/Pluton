-- Fleets.
CREATE TYPE fleet_state AS ENUM ('home', 'warp', 'arrived', 'return');

CREATE TABLE fleets (
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

CREATE SEQUENCE fleets_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

ALTER SEQUENCE fleets_id_seq OWNED BY fleets.id;

-- Planets.
CREATE TABLE planets (
    id integer NOT NULL
  , index integer NOT NULL
  , name text NOT NULL
  , ruler text NOT NULL
  , star_id integer NOT NULL
);

CREATE SEQUENCE planets_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

ALTER SEQUENCE planets_id_seq OWNED BY planets.id;

-- Stars.
CREATE TABLE stars (
    id integer NOT NULL
  , index integer NOT NULL
  , cluster integer NOT NULL
  , name text NOT NULL
);

CREATE SEQUENCE stars_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

ALTER SEQUENCE stars_id_seq OWNED BY stars.id;

-- Set nextvals.
ALTER TABLE ONLY fleets ALTER COLUMN id SET DEFAULT nextval('fleets_id_seq'::regclass);

ALTER TABLE ONLY planets ALTER COLUMN id SET DEFAULT nextval('planets_id_seq'::regclass);

ALTER TABLE ONLY stars ALTER COLUMN id SET DEFAULT nextval('stars_id_seq'::regclass);

-- Set foreign keys.
ALTER TABLE ONLY fleets
  ADD CONSTRAINT fleets_pkey PRIMARY KEY (id);

ALTER TABLE ONLY planets
  ADD CONSTRAINT planets_pkey PRIMARY KEY (id);

ALTER TABLE ONLY stars
  ADD CONSTRAINT stars_pkey PRIMARY KEY (id);

ALTER TABLE ONLY fleets
  ADD CONSTRAINT fleets_planet_id_fkey
  FOREIGN KEY (planet_id)
  REFERENCES planets(id);

ALTER TABLE ONLY fleets
  ADD CONSTRAINT fleets_target_planet_id_fkey
  FOREIGN KEY (target_id)
  REFERENCES planets(id);

ALTER TABLE ONLY planets
  ADD CONSTRAINT planets_star_id_fkey
  FOREIGN KEY (star_id)
  REFERENCES stars(id)
  ON UPDATE RESTRICT
  ON DELETE RESTRICT;
