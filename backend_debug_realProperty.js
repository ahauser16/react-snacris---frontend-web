// models/realProperty.js - FIXED VERSION
const db = require("../../../db");

/** Turn any "" into null (PG treats undefined as NULL) */
function sanitize(obj = {}) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === "" ? null : v])
  );
}

/**
 * Fetch saved real-property documents.
 * If documentId is provided, returns a single document object or null.
 * If documentId is omitted, returns an array of all documents for the user.
 */
async function getSavedRealPropertyDocument(username, documentId = null) {
  // Helper to fetch one master + its children
  async function fetchOne(master) {
    const id = master.id;
    const [legalsRes, partiesRes, refsRes, remarksRes] = await Promise.all([
      db.query(
        `SELECT * FROM saved_real_property_legals WHERE saved_master_id = $1`,
        [id]
      ),
      db.query(
        `SELECT * FROM saved_real_property_parties WHERE saved_master_id = $1`,
        [id]
      ),
      db.query(
        `SELECT * FROM saved_real_property_references WHERE saved_master_id = $1`,
        [id]
      ),
      db.query(
        `SELECT * FROM saved_real_property_remarks WHERE saved_master_id = $1`,
        [id]
      ),
    ]);
    return {
      master,
      legals: legalsRes.rows,
      parties: partiesRes.rows,
      references: refsRes.rows,
      remarks: remarksRes.rows,
    };
  }

  if (documentId) {
    // fetch single
    const mRes = await db.query(
      `SELECT * FROM saved_real_property_master
       WHERE username = $1 AND document_id = $2`,
      [username, documentId]
    );
    if (mRes.rowCount === 0) return null;
    return fetchOne(mRes.rows[0]);
  }

  // fetch all
  const allRes = await db.query(
    `SELECT * FROM saved_real_property_master WHERE username = $1`,
    [username]
  );
  const docs = await Promise.all(allRes.rows.map(fetchOne));
  return docs;
}

/**
 * Save (insert or update) a full real-property document in one transaction.
 * - Blank strings → NULL via sanitize
 * - Ensures 1 master, multiple legals allowed, 1 references, 1 remarks, 1–3 parties
 */
async function saveRealPropertyDocument(username, docInput) {
  const client = db;

  console.log("=== SAVE REAL PROPERTY DOCUMENT DEBUG ===");
  console.log("Username:", username);
  console.log("Input document structure:");
  console.log("- Master:", docInput.master ? "present" : "missing");
  console.log("- Legals array length:", (docInput.legals || []).length);
  console.log("- Parties array length:", (docInput.parties || []).length);
  console.log("- References array length:", (docInput.references || []).length);
  console.log("- Remarks array length:", (docInput.remarks || []).length);

  if (docInput.legals && docInput.legals.length > 0) {
    console.log("Legals data:", JSON.stringify(docInput.legals, null, 2));
  }

  try {
    await client.query("BEGIN");

    // sanitize all pieces
    const doc = {
      master: sanitize(docInput.master),
      legals: (docInput.legals || []).map(sanitize),
      parties: (docInput.parties || []).map(sanitize),
      references: (docInput.references || []).map(sanitize),
      remarks: (docInput.remarks || []).map(sanitize),
    };

    console.log("After sanitization:");
    console.log("- Legals:", doc.legals);
    console.log("- Parties:", doc.parties);

    // 1) Upsert master
    const mRes = await client.query(
      `INSERT INTO saved_real_property_master
         (username, document_id, record_type, crfn, recorded_borough, doc_type,
          document_date, document_amt, recorded_datetime, modified_date,
          reel_yr, reel_nbr, reel_pg, percent_trans, good_through_date)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       ON CONFLICT (username, document_id) DO UPDATE
         SET modified_date = EXCLUDED.modified_date
       RETURNING id`,
      [
        username,
        doc.master.document_id,
        doc.master.record_type,
        doc.master.crfn,
        doc.master.recorded_borough,
        doc.master.doc_type,
        doc.master.document_date,
        doc.master.document_amt,
        doc.master.recorded_datetime,
        doc.master.modified_date,
        doc.master.reel_yr,
        doc.master.reel_nbr,
        doc.master.reel_pg,
        doc.master.percent_trans,
        doc.master.good_through_date,
      ]
    );
    const masterId = mRes.rows[0].id;
    console.log("Master saved with ID:", masterId);

    // helper to batch-insert child arrays
    async function batchInsert(table, rows, columns) {
      if (!rows || rows.length === 0) {
        console.log(`batchInsert: No rows to insert for table ${table}`);
        return;
      }

      console.log(`=== batchInsert called for table: ${table} ===`);
      console.log(`Number of rows:`, rows.length);
      console.log(`Rows data:`, JSON.stringify(rows, null, 2));
      console.log(`Columns:`, columns);

      // First, clear existing records for this master (to handle updates)
      const deleteSQL = `DELETE FROM ${table} WHERE saved_master_id = $1`;
      console.log(`Clearing existing records: ${deleteSQL}`);
      await client.query(deleteSQL, [masterId]);

      const cols = columns.join(", ");
      const vals = [];
      const placeholders = rows
        .map((row, i) => {
          const start = i * columns.length + 1;
          columns.forEach((col) => {
            const value = col === "saved_master_id" ? masterId : row[col];
            vals.push(value);
            console.log(`Row ${i}, Column ${col}: ${value}`);
          });
          return "(" + columns.map((_, j) => `$${start + j}`).join(", ") + ")";
        })
        .join(", ");

      const sql = `INSERT INTO ${table} (${cols}) VALUES ${placeholders}`;

      console.log(`Generated SQL: ${sql}`);
      console.log(`Values: ${JSON.stringify(vals)}`);

      try {
        const result = await client.query(sql, vals);
        console.log(
          `Successfully inserted ${result.rowCount} rows into ${table}`
        );
      } catch (insertError) {
        console.error(`Error inserting into ${table}:`, insertError);
        throw insertError;
      }
    }

    // 2) FIXED: Save Legals (was missing!)
    console.log("=== Saving Legals ===");
    await batchInsert("saved_real_property_legals", doc.legals, [
      "saved_master_id",
      "record_type",
      "borough",
      "block",
      "lot",
      "easement",
      "partial_lot",
      "air_rights",
      "subterranean_rights",
      "property_type",
      "street_number",
      "street_name",
      "unit_address",
      "good_through_date",
    ]);

    // 3) Save Parties
    console.log("=== Saving Parties ===");
    const partiesWithIndex = doc.parties.map((party, index) => ({
      ...party,
      party_index: parseInt(party.party_type) || index + 1,
    }));

    await batchInsert("saved_real_property_parties", partiesWithIndex, [
      "saved_master_id",
      "party_index",
      "record_type",
      "party_type",
      "name",
      "address_1",
      "address_2",
      "country",
      "city",
      "state",
      "zip",
      "good_through_date",
    ]);

    // 4) References (0→1)
    console.log("=== Saving References ===");
    await batchInsert(
      "saved_real_property_references",
      doc.references.length ? doc.references : [{}],
      [
        "saved_master_id",
        "record_type",
        "reference_by_crfn",
        "reference_by_doc_id",
        "reference_by_reel_year",
        "reference_by_reel_borough",
        "reference_by_reel_nbr",
        "reference_by_reel_page",
        "good_through_date",
      ]
    );

    // 5) Remarks (0→1)
    console.log("=== Saving Remarks ===");
    await batchInsert(
      "saved_real_property_remarks",
      doc.remarks.length ? doc.remarks : [{}],
      [
        "saved_master_id",
        "record_type",
        "sequence_number",
        "remark_text",
        "good_through_date",
      ]
    );

    await client.query("COMMIT");
    console.log("=== TRANSACTION COMMITTED SUCCESSFULLY ===");
    return masterId;
  } catch (err) {
    console.error("=== ERROR IN SAVE TRANSACTION ===");
    console.error("Error details:", err);
    await client.query("ROLLBACK");
    throw err;
  }
}

/**
 * Delete a saved real-property document and all its children.
 * Returns the deleted document's master id, or null if not found.
 */
async function deleteRealPropertyDocument(username, documentId) {
  const res = await db.query(
    `DELETE FROM saved_real_property_master
      WHERE username = $1 AND document_id = $2
      RETURNING id`,
    [username, documentId]
  );
  return res.rowCount ? res.rows[0].id : null;
}

module.exports = {
  getSavedRealPropertyDocument,
  saveRealPropertyDocument,
  deleteRealPropertyDocument,
};
