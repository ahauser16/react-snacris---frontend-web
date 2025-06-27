// Updated route with debugging
router.post("/document", ensureLoggedIn, async function (req, res, next) {
  try {
    console.log("=== POST /document ROUTE CALLED ===");
    console.log("User:", res.locals.user.username);
    console.log("Request body keys:", Object.keys(req.body));
    console.log("Request body structure:");
    console.log("- master:", req.body.master ? "present" : "missing");
    console.log(
      "- legals:",
      Array.isArray(req.body.legals)
        ? `array[${req.body.legals.length}]`
        : req.body.legals
    );
    console.log(
      "- parties:",
      Array.isArray(req.body.parties)
        ? `array[${req.body.parties.length}]`
        : req.body.parties
    );
    console.log(
      "- references:",
      Array.isArray(req.body.references)
        ? `array[${req.body.references.length}]`
        : req.body.references
    );
    console.log(
      "- remarks:",
      Array.isArray(req.body.remarks)
        ? `array[${req.body.remarks.length}]`
        : req.body.remarks
    );

    if (req.body.legals) {
      console.log(
        "Full legals data:",
        JSON.stringify(req.body.legals, null, 2)
      );
    }

    const savedMasterId = await saveRealPropertyDocument(
      res.locals.user.username,
      req.body
    );

    console.log("=== SAVE COMPLETED SUCCESSFULLY ===");
    console.log("Saved master ID:", savedMasterId);

    return res.status(201).json({ savedMasterId });
  } catch (err) {
    console.error("=== ERROR IN POST /document ROUTE ===");
    console.error("Error:", err);
    console.error("Stack:", err.stack);
    return next(err);
  }
});
