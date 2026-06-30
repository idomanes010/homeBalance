--
-- PostgreSQL database dump
--

\restrict 8frduRWEIANtuPcDFiaqGNb2TeM16CF6UX3mcXQBQhRX9TuDp9dV9U2UqXfcQMp

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-30 13:13:11

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


-- Completed on 2026-06-30 13:13:11

--
-- PostgreSQL database dump complete
--

\unrestrict 8frduRWEIANtuPcDFiaqGNb2TeM16CF6UX3mcXQBQhRX9TuDp9dV9U2UqXfcQMp

