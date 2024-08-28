--"add_rifiuto_lotto"
BEGIN
  UPDATE ""Contenuto""
  SET qta = qta + 1
  WHERE lotto = lotto_input AND rifiuto LIKE rifiuto_input;
  IF NOT FOUND THEN
    INSERT INTO ""Contenuto"" (lotto, rifiuto, qta)
    VALUES (lotto_input, rifiuto_input, 1);
  END IF;
END;


--"consegna_lotto"
BEGIN
  INSERT INTO ""Accettazione"" (stabilimento, zona, comune, rifiuto, qta, data)
  SELECT stabilimento_input, zona_input, comune_input, c.rifiuto, c.qta, CURRENT_TIMESTAMP
  FROM ""Contenuto"" c
  WHERE c.lotto = lotto_input
  ON CONFLICT (stabilimento, zona, comune, rifiuto)
  DO UPDATE SET qta = ""Accettazione"".qta + EXCLUDED.qta;

  DELETE FROM ""Contenuto""
  WHERE lotto = lotto_input;
END;


--"createCorsa"
INSERT INTO ""Corse""
(inizio, camion, rotta, carico)
VALUES
(date, truck, route, null)


--"delete_rifiuto_lotto"
BEGIN
  DELETE FROM ""Contenuto""
  WHERE lotto = lotto_input AND rifiuto LIKE rifiuto_input;
END;


--"get_accettazione_rifiuti"
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
  ""Accettazione"" a
  left join ""Rifiuti"" r on r.codice = a.rifiuto::TEXT
  left join ""Tipologie_Rifiuti"" t on t.codice = r.tipo
where
  a.stabilimento like stabilimento_id
  and a.zona = zona_id
  and a.comune = codice_id;
end;


--"get_esecuzione_info"
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
     FROM ""Contenuto"" contenuto
     LEFT JOIN ""Rifiuti"" rifiuti ON contenuto.rifiuto = rifiuti.codice
     WHERE contenuto.lotto = carico.lotto), 0) AS peso,
    carico.stato
  FROM
    ""Esecuzione"" e
    LEFT JOIN ""Camion"" c ON e.camion LIKE c.targa
    LEFT JOIN ""Corse"" corse ON e.camion LIKE corse.camion AND e.inizio = corse.inizio
    LEFT JOIN ""Rotte"" r ON corse.rotta = r.codice
    LEFT JOIN ""Carichi"" carico ON corse.carico = carico.lotto
  WHERE
    e.utente LIKE utente_id;
END;


--"get_rifiuti_lotto"
BEGIN
  RETURN QUERY
  SELECT rifiuti.codice, rifiuti.descrizione, contenuto.qta
  FROM ""Contenuto"" contenuto
  LEFT JOIN ""Rifiuti"" rifiuti ON contenuto.rifiuto = rifiuti.codice
  WHERE contenuto.lotto = lotto_input;
END;


--"get_stabilimento_info"
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
    ""Stabilimenti"" s
    LEFT JOIN ""Zone"" z ON z.codice = s.zona
    LEFT JOIN ""Comuni"" c ON c.""CAP"" = s.comune
  WHERE
    s.codice LIKE stabilimento_code
    AND s.zona = zona_input
    AND s.comune = comune_input;
END;


--"get_stabilimento_info"
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
    ""Stabilimenti"" s
    left join ""Zone"" z on z.codice = s.zona
    left join ""Comuni"" c on c.""CAP"" = s.comune
  where
    s.codice like stabilimento_code;
end;


--"get_stato_carico"
BEGIN
  RETURN QUERY
  SELECT carichi.stato
  FROM ""Carichi"" carichi
  LEFT JOIN ""Corse"" corse ON carichi.lotto = corse.carico
  WHERE corse.inizio = inizio_input
  AND corse.camion LIKE targa_input;
END;


--"login"
SELECT * FROM ""Utenti""
WHERE ""Utenti"".email LIKE email AND ""Utenti"".password = password
LIMIT 1

-- Change to ILIKE if LIKE is case sensitive. (postgreSQL syntax)

-- "readUsers"
SELECT * FROM ""Utenti""


-- "registerUser"
INSERT into ""Utenti""
(cf, nome, cognome, indirizzo, telefono, email, password, tipo_contratto, ruolo)
VALUES
(cf, name, surname, address, tel, email, password, contractType, role);


-- "set_carico_consegnato"
BEGIN
  UPDATE ""Carichi""
  SET stato = 'Consegnato'
  WHERE lotto IN (
      SELECT carichi.lotto
      FROM ""Carichi"" carichi
      LEFT JOIN ""Corse"" corse ON carichi.lotto = corse.carico
      WHERE corse.inizio = inizio_input
      AND corse.camion LIKE targa_input
  );
END;


-- "set_carico_in_transito"
BEGIN
  UPDATE ""Carichi""
  SET stato = 'In transito'
  WHERE lotto IN (
      SELECT carichi.lotto
      FROM ""Carichi"" carichi
      LEFT JOIN ""Corse"" corse ON carichi.lotto = corse.carico
      WHERE corse.inizio = inizio_input
      AND corse.camion LIKE targa_input
  );
END;


-- "set_carico_preso_in_carico"
BEGIN
  UPDATE ""Carichi""
  SET stato = 'Preso in carico'
  WHERE lotto IN (
      SELECT carichi.lotto
      FROM ""Carichi"" carichi
      LEFT JOIN ""Corse"" corse ON carichi.lotto = corse.carico
      WHERE corse.inizio = inizio_input
      AND corse.camion LIKE targa_input
  );
END;


-- "trovaStabilimento"
BEGIN
    select
  s.codice as stabilimento_id,
  s.descrizione as stabilimento,
  z.descrizione as zona,
  c.nome as comune
from
  ""Stabilimenti"" s
  left join ""Zone"" z on z.codice = s.zona
  left join ""Comuni"" c on c.""CAP"" = s.comune
where
  s.codice like codiceInput;
END;

