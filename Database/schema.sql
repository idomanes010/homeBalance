--
-- PostgreSQL database dump
--

\restrict 9klAIIxG1WarGaMkNW492Ngz9p1l8sAx48bDrDoVnwJ8txQKMrZo7tUSt1l7cjk

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-30 12:09:34

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16471)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    category_name character varying(50) NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16470)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 5062 (class 0 OID 0)
-- Dependencies: 225
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 221 (class 1259 OID 16430)
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    id integer NOT NULL,
    household_id integer NOT NULL,
    title character varying(50) NOT NULL,
    amount numeric,
    expense_date date NOT NULL,
    note character varying(50),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    category_id integer,
    created_by integer
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16487)
-- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.expenses ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.expenses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 16417)
-- Name: households; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.households (
    id integer NOT NULL,
    house_name character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    invite_code character varying(10) NOT NULL,
    currency character varying(10) DEFAULT '$'::character varying
);


ALTER TABLE public.households OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16462)
-- Name: households_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.households ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.households_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 16448)
-- Name: monthly_budget; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.monthly_budget (
    id integer NOT NULL,
    household_id integer NOT NULL,
    budget_month character varying(7) CONSTRAINT monthly_budget_bodget_month_not_null NOT NULL,
    budget_amount numeric(10,2)
);


ALTER TABLE public.monthly_budget OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16504)
-- Name: monthly_budget_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.monthly_budget ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.monthly_budget_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 219 (class 1259 OID 16405)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(128) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    household_id integer NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16468)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4880 (class 2604 OID 16474)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 5054 (class 0 OID 16471)
-- Dependencies: 226
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, category_name) FROM stdin;
1	Food
2	Transport
3	Housing
4	Health
5	Entertainment
6	Shopping
7	Education
8	Groceries
9	Pleasure
10	Other
\.


--
-- TOC entry 5049 (class 0 OID 16430)
-- Dependencies: 221
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (id, household_id, title, amount, expense_date, note, created_at, category_id, created_by) FROM stdin;
2	7	grocery run	170	2026-06-17	Weekly supermarket	2026-06-17 11:49:38.040238+03	8	1
3	7	parm cheese	33	2026-06-23		2026-06-23 13:11:15.878049+03	1	1
7	13	tomato	10	2026-06-24		2026-06-24 13:29:04.862606+03	8	12
9	13	נייר	33	2026-06-24		2026-06-24 14:17:57.80996+03	3	12
11	13	סרט	55	2026-06-24		2026-06-24 14:18:45.566317+03	9	12
12	13	דלק	330	2026-06-24		2026-06-24 14:19:00.119329+03	2	12
13	13	זבנג	45	2026-06-24		2026-06-24 14:19:18.008428+03	3	12
14	13	פלסטר	12	2026-06-24		2026-06-24 14:19:38.019289+03	4	12
15	13	באולינג	43	2026-06-24		2026-06-24 14:20:01.302789+03	5	12
16	13	נעליים	300	2026-06-24	אולסטר חדשות\n	2026-06-24 14:20:22.315555+03	6	12
17	13	קלוד	60	2026-06-24		2026-06-24 14:20:47.46368+03	7	12
19	13	test	56	2026-07-24		2026-06-24 16:22:49.766089+03	2	12
8	13	מלפפון	122	2026-06-24		2026-06-24 14:17:34.118841+03	1	12
20	13	just check	5	2026-07-01		2026-06-29 12:19:31.694208+03	1	12
21	13	test seconde	44	2026-06-29		2026-06-29 12:22:41.896809+03	2	13
22	13	testing	43	2026-06-29		2026-06-29 14:41:55.291859+03	4	13
10	13	המבורגר	78	2026-06-24		2026-06-24 14:18:30.569655+03	1	12
18	13	סתם בדיקה	33	2026-06-24		2026-06-24 14:21:10.043369+03	10	12
\.


--
-- TOC entry 5048 (class 0 OID 16417)
-- Dependencies: 220
-- Data for Name: households; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.households (id, house_name, created_at, invite_code, currency) FROM stdin;
7	ido's household	2026-06-16 17:54:55.706923+03	QZPEO2	$
8	duzi's household	2026-06-16 18:47:08.970664+03	C2MGEZ	$
9	ido's household	2026-06-18 20:06:34.09831+03	IBBZNQ	$
10	vered's household	2026-06-18 20:19:03.822043+03	1VJQIL	$
11	ido's household	2026-06-18 20:39:19.065106+03	7DPJLW	$
12	udi's household	2026-06-19 12:05:33.425197+03	NG6VPY	$
14	ido's household	2026-06-29 16:16:48.149029+03	D03TPD	$
13	real's household	2026-06-24 13:27:52.989124+03	56B6EP	₪
\.


--
-- TOC entry 5050 (class 0 OID 16448)
-- Dependencies: 222
-- Data for Name: monthly_budget; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.monthly_budget (id, household_id, budget_month, budget_amount) FROM stdin;
4	7	2026-07	20000.00
6	7	2026-08	15000.00
8	7	2026-06	10000.00
10	13	2026-06	8000.00
14	13	2026-07	15000.00
\.


--
-- TOC entry 5047 (class 0 OID 16405)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, first_name, last_name, created_at, household_id) FROM stdin;
1	ido@gamil.com	54140b1608ff2606d4bb22be31fd4ffd781b490303c406b53d9b1e16891b421d575afa404941deed883e5b6fe47fc33171c8e93ae5d629f60cfb4217a3f58b65	ido	manes	2026-06-16 17:54:55.706923+03	7
2	jane@example.com	54140b1608ff2606d4bb22be31fd4ffd781b490303c406b53d9b1e16891b421d575afa404941deed883e5b6fe47fc33171c8e93ae5d629f60cfb4217a3f58b65	Jane	Doe	2026-06-16 17:56:01.478557+03	7
3	duzi@test.com	54140b1608ff2606d4bb22be31fd4ffd781b490303c406b53d9b1e16891b421d575afa404941deed883e5b6fe47fc33171c8e93ae5d629f60cfb4217a3f58b65	duzi	duz	2026-06-16 18:04:39.607299+03	7
4	duzi12@test.com	54140b1608ff2606d4bb22be31fd4ffd781b490303c406b53d9b1e16891b421d575afa404941deed883e5b6fe47fc33171c8e93ae5d629f60cfb4217a3f58b65	duzi	duz	2026-06-16 18:47:08.970664+03	8
5	duzi1123@test.com	54140b1608ff2606d4bb22be31fd4ffd781b490303c406b53d9b1e16891b421d575afa404941deed883e5b6fe47fc33171c8e93ae5d629f60cfb4217a3f58b65	duziduz	duz	2026-06-16 18:47:48.294318+03	8
6	ido@test.com	54140b1608ff2606d4bb22be31fd4ffd781b490303c406b53d9b1e16891b421d575afa404941deed883e5b6fe47fc33171c8e93ae5d629f60cfb4217a3f58b65	ido	ido	2026-06-18 20:06:34.09831+03	9
7	vered@test.com	54140b1608ff2606d4bb22be31fd4ffd781b490303c406b53d9b1e16891b421d575afa404941deed883e5b6fe47fc33171c8e93ae5d629f60cfb4217a3f58b65	vered	mmm	2026-06-18 20:19:03.822043+03	10
8	ido1@test.com	54140b1608ff2606d4bb22be31fd4ffd781b490303c406b53d9b1e16891b421d575afa404941deed883e5b6fe47fc33171c8e93ae5d629f60cfb4217a3f58b65	ido	ido	2026-06-18 20:39:19.065106+03	11
9	ido2@test.com	54140b1608ff2606d4bb22be31fd4ffd781b490303c406b53d9b1e16891b421d575afa404941deed883e5b6fe47fc33171c8e93ae5d629f60cfb4217a3f58b65	ido	ido	2026-06-18 20:39:48.638406+03	11
10	udi@text.com	54140b1608ff2606d4bb22be31fd4ffd781b490303c406b53d9b1e16891b421d575afa404941deed883e5b6fe47fc33171c8e93ae5d629f60cfb4217a3f58b65	udi	udi	2026-06-19 12:05:33.425197+03	12
11	udi2@test.com	54140b1608ff2606d4bb22be31fd4ffd781b490303c406b53d9b1e16891b421d575afa404941deed883e5b6fe47fc33171c8e93ae5d629f60cfb4217a3f58b65	udi	udi2	2026-06-19 12:06:07.589686+03	12
12	real@gmail.com	54140b1608ff2606d4bb22be31fd4ffd781b490303c406b53d9b1e16891b421d575afa404941deed883e5b6fe47fc33171c8e93ae5d629f60cfb4217a3f58b65	real	test	2026-06-24 13:27:52.989124+03	13
13	real2@gmail.com	54140b1608ff2606d4bb22be31fd4ffd781b490303c406b53d9b1e16891b421d575afa404941deed883e5b6fe47fc33171c8e93ae5d629f60cfb4217a3f58b65	real partner	yep	2026-06-29 12:20:12.986738+03	13
14	ido@gmail.com	54140b1608ff2606d4bb22be31fd4ffd781b490303c406b53d9b1e16891b421d575afa404941deed883e5b6fe47fc33171c8e93ae5d629f60cfb4217a3f58b65	ido	manes	2026-06-29 16:16:48.149029+03	14
\.


--
-- TOC entry 5063 (class 0 OID 0)
-- Dependencies: 225
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 10, true);


--
-- TOC entry 5064 (class 0 OID 0)
-- Dependencies: 227
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expenses_id_seq', 22, true);


--
-- TOC entry 5065 (class 0 OID 0)
-- Dependencies: 223
-- Name: households_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.households_id_seq', 14, true);


--
-- TOC entry 5066 (class 0 OID 0)
-- Dependencies: 228
-- Name: monthly_budget_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.monthly_budget_id_seq', 14, true);


--
-- TOC entry 5067 (class 0 OID 0)
-- Dependencies: 224
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 14, true);


--
-- TOC entry 4892 (class 2606 OID 16478)
-- Name: categories categories_category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_category_name_key UNIQUE (category_name);


--
-- TOC entry 4894 (class 2606 OID 16480)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4886 (class 2606 OID 16442)
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- TOC entry 4884 (class 2606 OID 16424)
-- Name: households households_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.households
    ADD CONSTRAINT households_pkey PRIMARY KEY (id);


--
-- TOC entry 4888 (class 2606 OID 16455)
-- Name: monthly_budget monthly_budget_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_budget
    ADD CONSTRAINT monthly_budget_pkey PRIMARY KEY (id);


--
-- TOC entry 4890 (class 2606 OID 16497)
-- Name: monthly_budget unique_household_month; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_budget
    ADD CONSTRAINT unique_household_month UNIQUE (household_id, budget_month);


--
-- TOC entry 4882 (class 2606 OID 16415)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4896 (class 2606 OID 16481)
-- Name: expenses expenses_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 4897 (class 2606 OID 16489)
-- Name: expenses expenses_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 4898 (class 2606 OID 16443)
-- Name: expenses household_id-household; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT "household_id-household" FOREIGN KEY (household_id) REFERENCES public.households(id);


--
-- TOC entry 4899 (class 2606 OID 16456)
-- Name: monthly_budget monthley_budget-household; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_budget
    ADD CONSTRAINT "monthley_budget-household" FOREIGN KEY (household_id) REFERENCES public.households(id);


--
-- TOC entry 4895 (class 2606 OID 16425)
-- Name: users users_households; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_households FOREIGN KEY (household_id) REFERENCES public.households(id) NOT VALID;


-- Completed on 2026-06-30 12:09:34

--
-- PostgreSQL database dump complete
--

\unrestrict 9klAIIxG1WarGaMkNW492Ngz9p1l8sAx48bDrDoVnwJ8txQKMrZo7tUSt1l7cjk

