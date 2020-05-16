-- Traits.
CREATE TABLE trait_types (
  id integer NOT NULL
, name text NOT NULL
);

CREATE SEQUENCE trait_types_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

ALTER SEQUENCE trait_types_id_seq OWNED BY trait_types.id;

CREATE TABLE traits (
  id integer NOT NULL
, squadron_id integer NOT NULL
);

CREATE SEQUENCE traits_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

ALTER SEQUENCE traits_id_seq OWNED BY traits.id;

-- Squadrons.
CREATE TABLE squadrons (
    id integer NOT NULL
  , index integer NOT NULL
  , name text NOT NULL
  , ships integer DEFAULT 0 NOT NULL
  , fleet_id integer NOT NULL
);

CREATE SEQUENCE squadrons_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

ALTER SEQUENCE squadrons_id_seq OWNED BY squadrons.id;

-- Fleets.
CREATE TYPE fleet_state AS ENUM ('home', 'warp', 'arrived', 'return');

CREATE TABLE fleets (
    id integer NOT NULL
  , index integer NOT NULL
  , name text NOT NULL
  , is_base boolean DEFAULT false NOT NULL
  , planet_id integer NOT NULL
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

ALTER TABLE ONLY fleets
  ALTER COLUMN id
  SET DEFAULT nextval('fleets_id_seq'::regclass);

ALTER TABLE ONLY fleets
  ADD CONSTRAINT fleets_pkey PRIMARY KEY (id);

-- Planets.
CREATE TABLE planets (
    id integer NOT NULL
  , index integer NOT NULL
  , name text NOT NULL
  , ruler text NOT NULL
  -- Mineral.
  , asteroid_m integer DEFAULT 0 NOT NULL
  , resource_m integer DEFAULT 0 NOT NULL
  -- Chemical.
  , asteroid_c integer DEFAULT 0 NOT NULL
  , resource_c integer DEFAULT 0 NOT NULL
  -- Radioactive.
  , asteroid_r integer DEFAULT 0 NOT NULL
  , resource_r integer DEFAULT 0 NOT NULL
  , star_id integer NOT NULL
);

CREATE SEQUENCE planets_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

ALTER SEQUENCE planets_id_seq OWNED BY planets.id;

ALTER TABLE ONLY planets
  ALTER COLUMN id
  SET DEFAULT nextval('planets_id_seq'::regclass);

ALTER TABLE ONLY planets
  ADD CONSTRAINT planets_pkey PRIMARY KEY (id);

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

ALTER TABLE ONLY stars
  ALTER COLUMN id
  SET DEFAULT nextval('stars_id_seq'::regclass);

ALTER TABLE ONLY stars
  ADD CONSTRAINT stars_pkey PRIMARY KEY (id);

-- Users.
CREATE TABLE users (
    id integer NOT NULL
  , username text NOT NULL
  , password text NOT NULL
  , token text NULL
  , planet_id integer NOT NULL
);

CREATE SEQUENCE users_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

ALTER SEQUENCE users_id_seq OWNED BY users.id;

ALTER TABLE ONLY users
  ALTER COLUMN id
  SET DEFAULT nextval('users_id_seq'::regclass);

-- Set foreign keys.
ALTER TABLE ONLY fleets
  ADD CONSTRAINT fleets_planet_id_fkey
  FOREIGN KEY (planet_id)
  REFERENCES planets(id);

ALTER TABLE ONLY fleets
  ADD CONSTRAINT fleets_target_id_fkey
  FOREIGN KEY (target_id)
  REFERENCES planets(id);

ALTER TABLE ONLY planets
  ADD CONSTRAINT planets_star_id_fkey
  FOREIGN KEY (star_id)
  REFERENCES stars(id)
  ON UPDATE RESTRICT
  ON DELETE RESTRICT;
