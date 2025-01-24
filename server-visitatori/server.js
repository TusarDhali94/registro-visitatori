const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const moment = require('moment'); //Questo modulo per per prendere la data corrente 

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configurazione SQL Server
const dbConfig = {
  user: 'sa',      // Il tuo username di SQL Server
  password: 'Novoincipient3!',  // La tua password di SQL Server
  server: 'NBTUSARD',        // Cambia con il nome del tuo server SQL
  database: 'DATIREGISTRO',      // Nome del database creato
  options: {
    encrypt: false, // False se non hai la crittografia SSL
    trustServerCertificate: true, // Solo se necessario per evitare errori
  },
};


// Endpoint per salvare i dati dei visitatori
app.post('/api/visitors', async (req, res) => {
  const { Operatore: Operatore, RiferenteInterno, Ditta, Email, FirmaIn,FirmaOut,DataUscita} = req.body;
  

  // Ottieni la data corrente in formato YYYY-MM-DD
  const dataOggi = moment().format('YYYY-MM-DD');
   
  try {
    
    const pool = await sql.connect(dbConfig);
     /*Controllo se esiste almeno un visitatore */
    const controlloVisitatori = await pool
    .request()
    .input('Operatore', sql.NVarChar, Operatore.trim())
    .input('dataOggi', sql.NVarChar, dataOggi)
    .query(`
      SELECT TOP 1 * 
      FROM XUVISITATORI 
      WHERE Operatore COLLATE SQL_Latin1_General_CP1_CI_AS = @Operatore  AND CONVERT(DATE, DataEntrata) = @dataOggi
      ORDER BY DataEntrata DESC
    `);

     console.log(dataOggi)
     console.log(controlloVisitatori)

     // Se il visitatore esiste per la data odierna
    if (controlloVisitatori.recordset.length > 0) {

      const visitatori = controlloVisitatori.recordset[0];

      console.log(visitatori.DataUscita)
      console.log(visitatori.FirmaOut)


       // Controllo se DataUscita e FirmaOut sono presenti
       if ((!visitatori.DataUscita || visitatori.DataUscita === '') && (!visitatori.FirmaOut || visitatori.FirmaOut === ''))  {
        
        return res.status(400).send({
          message: `Il visitatore "${Operatore}" non ha ancora completato la firma di uscita per oggi. Completa la firma di uscita prima di registrare una nuova entrata.`,
        });
      }
    }


    await pool
      .request()
      .input('Operatore', sql.NVarChar, Operatore.trim())
      .input('RiferenteInterno', sql.NVarChar, RiferenteInterno.trim())
      .input('Ditta', sql.NVarChar, Ditta.trim())
      .input('Email', sql.NVarChar, Email.trim())
      .input('FirmaIn', sql.NVarChar, FirmaIn) // Firma in base64
      .input('FirmaOut', sql.NVarChar, FirmaOut) // Firma in base64
      .input('DataUscita', sql.NVarChar, DataUscita) 
      .query(
        `INSERT INTO XUVISITATORI (Operatore, RiferenteInterno, Ditta, Email, FirmaIn,FirmaOut,DataUscita )
         VALUES (@Operatore, @RiferenteInterno, @Ditta, @Email, @FirmaIn, @FirmaOut,@DataUscita)`
      );

    res.status(200).send({ message: 'Dati salvati con successo!' });
  } catch (err) {
    console.error('Errore:', err.message);
    res.status(500).send({ message: 'Errore durante il salvataggio dei dati.' });
  }
});

// Endpoint per verificare utente admin
app.post('/api/adminUtente', async (req, res) => {
  const {nome_utente, password} = req.body; // Ottieni i dati inviati nel body della richiesta
  try {
    const pool = await sql.connect(dbConfig);

    // Esegui una query per trovare un utente con username e password corrispondenti
    const result = await pool
      .request()
      .input('nome_utente', sql.NVarChar, nome_utente)
      .input('password', sql.NVarChar, password) // Assicurati di criptare la password prima di inviarla
      .query(
        `SELECT user_id,nome_utente,password 
         FROM XUADMIN 
         WHERE nome_utente = @nome_utente AND password = @password`
      );
      if (result.recordset.length > 0) {
        const user = result.recordset[0]; // Ottieni l'utente trovato
        res.status(200).send({
          message: 'Login effettuato con successo!',
          userId: user.user_iduser_id, // Restituisci l'id dell'utente
          nome_utenti: user.nome_utenti, // Restituisci lo username
        });
      } else {
        res.status(401).send({ message: 'Credenziali non valide.' });
      }
    } catch (err) {
      console.error('Errore:', err.message);
      res.status(500).send({ message: 'Errore durante l\'autenticazione.' });
    }
});

// Endpoint per recuperare i dati dei visitatori 
app.get('/api/recuperaVisitatori', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    // Recupera i dati dalla tabella "Visitors" (adatta a seconda del tuo schema)
    const result = await pool.request().query('SELECT * FROM XUVISITATORI');
    res.status(200).send(result.recordset);  // Restituisce i dati in formato JSON
  } catch (err) {
    console.error('Errore:', err.message);
    res.status(500).send({ message: 'Errore durante il recupero dei dati.' });
  }
});


// Endpoint per aggiornare la firma di uscita
app.put('/api/firmaUscita', async (req, res) => {
  const { Operatore, FirmaOut, DataUscita } = req.body;

  try {
    const dataOggi = moment().format('YYYY-MM-DD');
    // Configura la connessione
    const pool = await sql.connect(dbConfig);  // Assicurati di usare un pool di connessioni per gestire le risorse
    // Cerca il visitatore con l'Operatore
    const result = await pool.request()
      .input('Operatore', sql.NVarChar, Operatore.trim())
      .input('dataOggi', sql.NVarChar, dataOggi)
      .query(`
        SELECT TOP 1 * 
        FROM XUVISITATORI 
        WHERE Operatore COLLATE SQL_Latin1_General_CP1_CI_AS = @Operatore  
        AND CONVERT(DATE, DataEntrata) = @dataOggi 
        AND (DataUscita IS NULL OR DataUscita = '')
        ORDER BY DataEntrata DESC
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Visitatore non trovato' });
    }

    // Aggiorna la firma di uscita e la data di uscita
    const updateQuery = `
      UPDATE XUVISITATORI
      SET FirmaOut = @FirmaOut, DataUscita = @DataUscita
      WHERE Operatore COLLATE SQL_Latin1_General_CP1_CI_AS = @Operatore  AND CONVERT(DATE, DataEntrata) = @dataOggi AND (DataUscita IS NULL OR DataUscita = '')`;

    await pool.request()
      .input('FirmaOut', sql.NVarChar, FirmaOut)
      .input('DataUscita', sql.NVarChar, DataUscita)  // Assicurati che DataUscita sia in formato stringa o datetime
      .input('Operatore', sql.NVarChar, Operatore.trim())
      .input('dataOggi', sql.Date, dataOggi)  // Inserisci anche qui la variabile dataOggi
      .query(updateQuery);

    res.status(200).json({ message: 'Firma di uscita registrata con successo' });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento:', error);
    res.status(500).json({ message: 'Errore interno del server', error });
  } finally {
    // Chiudi la connessione al database
    await sql.close();
  }
});

// Cambia "<nome-app>" con il nome della tua app Angular nella cartella "dist"
const distFolder = path.join(__dirname, '../dist/registro-visitatori');

// Servire i file statici di Angular
app.use(express.static(distFolder));

// Reindirizzare tutte le richieste alla homepage Angular (index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(distFolder, 'index.html'));
});


// Avvio del server
app.listen(port, () => {
  console.log(`Server avviato su http://localhost:${port}`);
});
