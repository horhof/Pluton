CREATE TABLE public.fleets (
    id integer NOT NULL,
    name text NOT NULL,
    index integer NOT NULL,
    moving boolean NOT NULL,
    mobile boolean NOT NULL,
    travel_time integer,
    planet_id integer NOT NULL,
    size integer DEFAULT 0 NOT NULL
);

CREATE SEQUENCE public.fleets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.fleets_id_seq OWNED BY public.fleets.id;

CREATE TABLE public.planets (
    id integer NOT NULL,
    name text,
    index integer,
    star_id integer
);

CREATE SEQUENCE public.planets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.planets_id_seq OWNED BY public.planets.id;

CREATE TABLE public.stars (
    id integer NOT NULL,
    index integer NOT NULL,
    cluster integer NOT NULL,
    name text NOT NULL
);

COMMENT ON COLUMN public.stars.index IS 'The position of this star within its cluster';
COMMENT ON COLUMN public.stars.cluster IS 'The cluster that this star is a part of';

CREATE SEQUENCE public.stars_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.stars_id_seq OWNED BY public.stars.id;

ALTER TABLE ONLY public.fleets ALTER COLUMN id SET DEFAULT nextval('public.fleets_id_seq'::regclass);

ALTER TABLE ONLY public.planets ALTER COLUMN id SET DEFAULT nextval('public.planets_id_seq'::regclass);

ALTER TABLE ONLY public.stars ALTER COLUMN id SET DEFAULT nextval('public.stars_id_seq'::regclass);

ALTER TABLE ONLY public.fleets
    ADD CONSTRAINT fleets_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.planets
    ADD CONSTRAINT planets_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.stars
    ADD CONSTRAINT stars_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fleets
    ADD CONSTRAINT fleets_planet_id_fkey FOREIGN KEY (planet_id) REFERENCES public.planets(id);

ALTER TABLE ONLY public.planets
    ADD CONSTRAINT planets_star_id_fkey FOREIGN KEY (star_id) REFERENCES public.stars(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
