// CORRECTED saveRealPropertyDocument function
// Replace the section in your realProperty.js after the master save

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
    console.log(`Successfully inserted ${result.rowCount} rows into ${table}`);
  } catch (insertError) {
    console.error(`Error inserting into ${table}:`, insertError);
    throw insertError;
  }
}

// 2) FIXED: Save Legals (this was completely missing!)
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

// 3) Save Parties (this was incorrectly labeled as "Legals" before)
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
