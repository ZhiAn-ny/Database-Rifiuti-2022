--  procedure_name                  --  function_definition                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ...

--  add_rifiuto_lotto               
CREATE OR REPLACE FUNCTION public.add_rifiuto_lotto(rifiuto_input text, lotto_input bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE "Contenuto"
  SET qta = qta + 1
  WHERE lotto = lotto_input AND rifiuto LIKE rifiuto_input;
  IF NOT FOUND THEN
    INSERT INTO "Contenuto" (lotto, rifiuto, qta)
    VALUES (lotto_input, rifiuto_input, 1);
  END IF;
END;
$function$

--  add_rifiuto_lotto_update_weight 
CREATE OR REPLACE PROCEDURE public.add_rifiuto_lotto_update_weight(IN lotto_input integer, IN rifiuto_input character varying)
 LANGUAGE plpgsql
AS $procedure$
BEGIN
  UPDATE "Contenuto"
  SET qta = qta + 1
  WHERE lotto = lotto_input AND rifiuto LIKE rifiuto_input;
  IF NOT FOUND THEN
    INSERT INTO "Contenuto" (lotto, rifiuto, qta)
    VALUES (lotto_input, rifiuto_input, 1);
  END IF;
  UPDATE "Carichi"
  SET peso = peso + (SELECT peso from "Rifiuti" WHERE codice like rifiuto_input)
  WHERE lotto = lotto_input;
END;
$procedure$

--  add_tappa_to_rotta              
CREATE OR REPLACE FUNCTION public.add_tappa_to_rotta(stabilimento_id text, zona_id bigint, comune_zip bigint, rotta_id bigint, description text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  prec BIGINT; 
  new_codice BIGINT;
BEGIN
  
  SELECT codice INTO prec
  FROM "Tappe" WHERE rotta = rotta_id AND successiva IS NULL;
  
  INSERT INTO "Tappe"
  (rotta, precedente, stabilimento, zona, comune, descrizione)
  VALUES
  (rotta_id, prec, stabilimento_id, zona_id, comune_zip, description)
  RETURNING codice INTO new_codice;

  UPDATE "Tappe" 
  SET successiva = new_codice
  WHERE codice = prec;

END;
$function$


Consegna_lotto                  
CREATE OR REPLACE FUNCTION public.consegna_lotto(lotto_input bigint, stabilimento_input character varying, zona_input bigint, comune_input bigint, data_carico_input timestamp with time zone)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO "Magazzino" (lotto, stabilimento, zona, comune, data_carico, data_scarico)
  VALUES (lotto_input, stabilimento_input, zona_input, comune_input, data_carico_input, CURRENT_TIMESTAMP);
END;
$function$


CreateCorsa                     
CREATE OR REPLACE FUNCTION public."createCorsa"(date timestamp with time zone, truck character varying, route integer)
 RETURNS void
 LANGUAGE sql
AS $function$INSERT INTO "Corse"
(inizio, camion, rotta, carico)
VALUES
(date, truck, route, null)$function$

--  delete_rifiuto_lotto            
CREATE OR REPLACE FUNCTION public.delete_rifiuto_lotto(rifiuto_input text, lotto_input bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM "Contenuto"
  WHERE lotto = lotto_input AND rifiuto LIKE rifiuto_input;
END;
$function$

--  get_accettazione_rifiuti        
CREATE OR REPLACE FUNCTION public.get_accettazione_rifiuti(stabilimento_id text, zona_id bigint, codice_id bigint)
 RETURNS TABLE(rifiuto_id character varying, rifiuto character varying, data timestamp with time zone, quantita bigint, peso double precision, tipo_rifiuto character varying, riciclabile boolean, ingombrante boolean, pericoloso boolean)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  select
  a.rifiuto as rifiuto_id,
  r.descrizione as rifiuto,
  a.data as data,
  a.qta as quantita,
  COALESCE((r.peso * a.qta), 0) as peso,
  t.descrizione as tipo_rifiuto,
  t.riciclabile as riciclabile,
  t.ingombrante as ingombrante,
  t.pericoloso as pericoloso
from
  "Accettazione" a
  left join "Rifiuti" r on r.codice = a.rifiuto::TEXT
  left join "Tipologie_Rifiuti" t on t.codice = r.tipo
where
  a.stabilimento like stabilimento_id
  and a.zona = zona_id
  and a.comune = codice_id;
end;
$function$

--  get_esecuzione_info             
CREATE OR REPLACE FUNCTION public.get_esecuzione_info(utente_id text)
 RETURNS TABLE(inizio timestamp with time zone, targa character varying, guida boolean, rotta_id bigint, rotta_des character varying, carico_id bigint, peso double precision, stato character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    e.inizio,
    e.camion AS targa,
    e.guida,
    r.codice AS rotta_id,
    r.descrizione AS rotta_des,
    carico.lotto AS carico_id,
    COALESCE((SELECT SUM(rifiuti.peso * contenuto.qta)
     FROM "Contenuto" contenuto
     LEFT JOIN "Rifiuti" rifiuti ON contenuto.rifiuto = rifiuti.codice
     WHERE contenuto.lotto = carico.lotto), 0) AS peso,
    carico.stato
  FROM
    "Esecuzione" e
    LEFT JOIN "Camion" c ON e.camion LIKE c.targa
    LEFT JOIN "Corse" corse ON e.camion LIKE corse.camion AND e.inizio = corse.inizio
    LEFT JOIN "Rotte" r ON corse.rotta = r.codice
    LEFT JOIN "Carichi" carico ON corse.carico = carico.lotto
  WHERE
    e.utente LIKE utente_id;
END;
$function$

--  get_magazzino_rifiuti           
CREATE OR REPLACE FUNCTION public.get_magazzino_rifiuti(stabilimento_id text, zona_id bigint, codice_id bigint)
 RETURNS TABLE(lotto_appartenenza bigint, rifiuto_id character varying, rifiuto character varying, data_carico timestamp with time zone, data_scarico timestamp with time zone, quantita bigint, peso double precision, tipo_rifiuto character varying, tipo_rifiuto_des character varying, riciclabile boolean, ingombrante boolean, pericoloso boolean)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  select
  m.lotto as lotto_appartenenza,
  c.rifiuto as rifiuto_id,
  r.descrizione as rifiuto,
  m.data_carico as data_carico,
  m.data_scarico as data_scarico,
  c.qta as quantita,
  COALESCE((r.peso * c.qta), 0) as peso,
  t.codice as tipo_rifiuto,
  t.descrizione as tipo_rifiuto_des,
  t.riciclabile as riciclabile,
  t.ingombrante as ingombrante,
  t.pericoloso as pericoloso
from
  "Magazzino" m
  left join "Contenuto" c on m.lotto = c.lotto
  left join "Rifiuti" r on c.rifiuto like r.codice
  left join "Tipologie_Rifiuti" t on t.codice like r.tipo
where
  m.stabilimento like stabilimento_id
  and m.zona = zona_id
  and m.comune = codice_id
  and r.descrizione IS NOT NULL;
end;
$function$

--  get_rifiuti_by_categoria        
CREATE OR REPLACE FUNCTION public.get_rifiuti_by_categoria(tipologia_id character varying)
 RETURNS TABLE(rifiuto_id character varying, rifiuto_des character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT codice as rifiuto_id, descrizione as rifiuto_des
  FROM "Rifiuti"
  WHERE tipo LIKE tipologia_id;
END;
$function$

--  get_rifiuti_generici            
CREATE OR REPLACE FUNCTION public.get_rifiuti_generici()
 RETURNS TABLE(tipologia_id character varying, tipologia_des character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT codice as tipologia_id, descrizione as tipologia_des
  FROM "Rifiuti"
  WHERE CAST(codice AS NUMERIC) < 0;
END;
$function$

--  get_rifiuti_lotto               
CREATE OR REPLACE FUNCTION public.get_rifiuti_lotto(lotto_input bigint)
 RETURNS TABLE(rifiuto_id character varying, rifiuto_des character varying, qta bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT rifiuti.codice, rifiuti.descrizione, contenuto.qta
  FROM "Contenuto" contenuto
  LEFT JOIN "Rifiuti" rifiuti ON contenuto.rifiuto = rifiuti.codice
  WHERE contenuto.lotto = lotto_input;
END;
$function$

--  get_rifiuto_by_id               
CREATE OR REPLACE FUNCTION public.get_rifiuto_by_id(rifiuto_id character varying)
 RETURNS TABLE(rifiuto character varying, rifiuto_des character varying, peso real, tipologia_des character varying, riciclabile boolean, ingombrante boolean, pericoloso boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    r.codice AS rifiuto, 
    r.descrizione AS rifiuto_des,
    r.peso,
    t.descrizione AS tipologia_des,
    t.riciclabile,
    t.ingombrante,
    t.pericoloso
  FROM 
    "Rifiuti" r
  JOIN 
    "Tipologie_Rifiuti" t ON r.tipo = t.codice
  WHERE 
    r.codice = rifiuto_id;
END;
$function$

--  get_stabilimento_info           
CREATE OR REPLACE FUNCTION public.get_stabilimento_info(stabilimento_code text)
 RETURNS TABLE(stabilimento_id character varying, stabilimento character varying, zona_id bigint, zona character varying, comune_id bigint, comune character varying)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  select
    s.codice as stabilimento_id,
    s.descrizione as stabilimento,
    s.zona as zona_id,
    z.descrizione as zona,
    s.comune as comune_id,
    c.nome as comune
  from
    "Stabilimenti" s
    left join "Zone" z on z.codice = s.zona
    left join "Comuni" c on c."CAP" = s.comune
  where
    s.codice like stabilimento_code;
end;
$function$

--  get_stabilimento_info           
CREATE OR REPLACE FUNCTION public.get_stabilimento_info(stabilimento_code text, zona_input bigint, comune_input bigint)
 RETURNS TABLE(stabilimento_id character varying, stabilimento character varying, zona_id bigint, zona character varying, comune_id bigint, comune character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    s.codice AS stabilimento_id,
    s.descrizione AS stabilimento,
    s.zona AS zona_id,
    z.descrizione AS zona,
    s.comune AS comune_id,
    c.nome AS comune
  FROM
    "Stabilimenti" s
    LEFT JOIN "Zone" z ON z.codice = s.zona
    LEFT JOIN "Comuni" c ON c."CAP" = s.comune
  WHERE
    s.codice LIKE stabilimento_code
    AND s.zona = zona_input
    AND s.comune = comune_input;
END;
$function$

--  get_stato_carico                
CREATE OR REPLACE FUNCTION public.get_stato_carico(inizio_input timestamp with time zone, targa_input text)
 RETURNS TABLE(stato character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT carichi.stato
  FROM "Carichi" carichi
  LEFT JOIN "Corse" corse ON carichi.lotto = corse.carico
  WHERE corse.inizio = inizio_input
  AND corse.camion LIKE targa_input;
END;
$function$

--  get_stats_utenti_corse          
CREATE OR REPLACE FUNCTION public.get_stats_utenti_corse()
 RETURNS TABLE(userid character varying, firstname character varying, lastname character varying, count bigint, guidate bigint, operate bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  
  SELECT
    utente, nome, cognome,
    count(0), sum(flagGuida) AS guidate,
    count(0)-sum(flagGuida) AS operate
  FROM (
    SELECT *, CASE
      WHEN guida IS TRUE THEN 1
      WHEN guida IS FALSE THEN 0
      ELSE 0 -- This handles the case where guida is NULL
    END AS flagGuida
  FROM "Esecuzione"
  LEFT JOIN "Utenti" ON "Esecuzione".utente = "Utenti".cf
  ) AS ExecWithFlag
  GROUP BY utente, nome, cognome;

END;
$function$

--  get_storage_stats               
CREATE OR REPLACE FUNCTION public.get_storage_stats()
 RETURNS TABLE(comune bigint, zona bigint, stabilimento_cod character varying, stabilimento_des character varying, indirizo character varying, lotto bigint, qta bigint, rifiuto_cod character varying, rifiuto_des character varying, peso_singolo real, tipologia_cod character varying, tipologia_des character varying, peso_totale double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  
  SELECT * FROM (
    SELECT 
    "Magazzino".comune, "Magazzino".zona, "Magazzino".stabilimento,
    "Stabilimenti".descrizione, "Stabilimenti".indirizzo,
    "Carichi".lotto,
    "Contenuto".qta,
    "Rifiuti".codice, "Rifiuti".descrizione, "Rifiuti".peso,
    "Tipologie_Rifiuti".codice as tipologiaCod, "Tipologie_Rifiuti".descrizione as tipologiaDes,
    "Rifiuti".peso * "Contenuto".qta AS pesoTotale
    FROM "Magazzino"
    LEFT JOIN "Carichi" ON "Carichi".lotto = "Magazzino".lotto
    LEFT JOIN "Contenuto" ON "Contenuto".lotto = "Carichi".lotto
    LEFT JOIN "Rifiuti" ON "Rifiuti".codice = "Contenuto".rifiuto
    LEFT JOIN "Tipologie_Rifiuti" ON "Tipologie_Rifiuti".codice = "Rifiuti".tipo
    LEFT JOIN "Stabilimenti" ON "Stabilimenti".comune = "Magazzino".comune
      AND "Stabilimenti".zona = "Magazzino".zona
      AND "Stabilimenti".codice = "Magazzino".stabilimento
    WHERE "Contenuto".qta > 0
  ) AS FromStorage
  UNION
  SELECT * FROM (
    SELECT 
    "Accettazione".comune, "Accettazione".zona, "Accettazione".stabilimento,
    "Stabilimenti".descrizione, "Stabilimenti".indirizzo,
    -1 AS lotto,
    "Accettazione".qta,
    "Rifiuti".codice, "Rifiuti".descrizione, "Rifiuti".peso,
    "Tipologie_Rifiuti".codice as tipologiaCod, "Tipologie_Rifiuti".descrizione as tipologiaDes,
    "Rifiuti".peso * "Accettazione".qta AS pesoTotale
    FROM "Accettazione"
    LEFT JOIN "Rifiuti" ON "Rifiuti".codice = "Accettazione".rifiuto
    LEFT JOIN "Tipologie_Rifiuti" ON "Tipologie_Rifiuti".codice = "Rifiuti".tipo
    LEFT JOIN "Stabilimenti" ON "Stabilimenti".comune = "Accettazione".comune
      AND "Stabilimenti".zona = "Accettazione".zona
      AND "Stabilimenti".codice = "Accettazione".stabilimento
  ) AS FromCitizens;
END;
$function$

--  get_total_worked_time           
CREATE OR REPLACE FUNCTION public.get_total_worked_time()
 RETURNS TABLE(firstname character varying, lastname character varying, userid character varying, workedtime interval)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  
  SELECT nome, cognome, cf, SUM(elapsed) AS total
  FROM (
    SELECT *, AGE("Turni".fine, "Turni".inizio) AS elapsed FROM "Utenti"
    LEFT JOIN "Turni" ON "Turni".utente = "Utenti".cf
  ) AS UtentixTurni
  WHERE elapsed > interval '0 seconds' -- DISCARD INVALID RECORDS
  GROUP BY nome, cognome, cf;
END;
$function$

--  login                           
CREATE OR REPLACE FUNCTION public.login(email character varying, password character varying)
 RETURNS record
 LANGUAGE sql
AS $function$SELECT * FROM "Utenti"
WHERE "Utenti".email LIKE email AND "Utenti".password = password
LIMIT 1


--  readUsers                       
CREATE OR REPLACE FUNCTION public."readUsers"()
 RETURNS record
 LANGUAGE sql
AS $function$SELECT * FROM "Utenti"$function$

--  registerUser                    
CREATE OR REPLACE FUNCTION public."registerUser"(cf character varying, name character varying, surname character varying, address character varying, tel character varying, email character varying, password character varying, contracttype integer, role integer)
 RETURNS void
 LANGUAGE sql
AS $function$INSERT into "Utenti"
(cf, nome, cognome, indirizzo, telefono, email, password, tipo_contratto, ruolo)
VALUES
(cf, name, surname, address, tel, email, password, contractType, role);$function$

--  set_carico_consegnato           
CREATE OR REPLACE FUNCTION public.set_carico_consegnato(inizio_input timestamp with time zone, targa_input text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE "Carichi"
  SET stato = 'Consegnato'
  WHERE lotto IN (
      SELECT carichi.lotto
      FROM "Carichi" carichi
      LEFT JOIN "Corse" corse ON carichi.lotto = corse.carico
      WHERE corse.inizio = inizio_input
      AND corse.camion LIKE targa_input
  );
END;
$function$

--  set_carico_in_transito          
CREATE OR REPLACE FUNCTION public.set_carico_in_transito(inizio_input timestamp with time zone, targa_input text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE "Carichi"
  SET stato = 'In transito'
  WHERE lotto IN (
      SELECT carichi.lotto
      FROM "Carichi" carichi
      LEFT JOIN "Corse" corse ON carichi.lotto = corse.carico
      WHERE corse.inizio = inizio_input
      AND corse.camion LIKE targa_input
  );
END;
$function$

--  set_carico_preso_in_carico      
CREATE OR REPLACE FUNCTION public.set_carico_preso_in_carico(inizio_input timestamp with time zone, targa_input text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE "Carichi"
  SET stato = 'Preso in carico'
  WHERE lotto IN (
      SELECT carichi.lotto
      FROM "Carichi" carichi
      LEFT JOIN "Corse" corse ON carichi.lotto = corse.carico
      WHERE corse.inizio = inizio_input
      AND corse.camion LIKE targa_input
  );
END;
$function$

--  trovaStabilimento               
CREATE OR REPLACE FUNCTION public."trovaStabilimento"(codiceinput text)
 RETURNS record
 LANGUAGE plpgsql
AS $function$BEGIN
    select
  s.codice as stabilimento_id,
  s.descrizione as stabilimento,
  z.descrizione as zona,
  c.nome as comune
from
  "Stabilimenti" s
  left join "Zone" z on z.codice = s.zona
  left join "Comuni" c on c."CAP" = s.comune
where
  s.codice like codiceInput;
END;$function$
