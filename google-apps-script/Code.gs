/**
 * I-NEX AI Training Program — Landing Page Registration Backend
 * Google Apps Script Web App
 *
 * Accepts POST requests from the landing page form, validates input,
 * writes registrations to a Google Sheet, and returns JSON responses.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

/** Name of the Google Sheet (tab) that stores registrations. */
var SHEET_NAME = "Реєстрації";

/** Spreadsheet owner/admin email address for notifications. */
var ADMIN_EMAIL = "your-email@example.com";

// ============================================================================
// CORS & RESPONSE HELPERS
// ============================================================================

/**
 * Returns a JSON HTTP response with appropriate CORS headers.
 *
 * @param {Object} data - The payload to return as JSON.
 * @param {number} statusCode - HTTP status code (default 200).
 * @returns {GoogleAppsScript.Content.TextOutput}
 */
function jsonResponse(data, statusCode) {
  statusCode = statusCode || 200;
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handles OPTIONS (pre-flight) requests for CORS.
 */
function doOptions() {
  return ContentService
    .createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Handles GET requests. Returns a simple health check.
 */
function doGet(e) {
  return jsonResponse({
    status: "ok",
    message: "I-NEX AI registration endpoint is running. Send a POST request to submit a registration."
  });
}

// ============================================================================
// REQUEST HANDLER
// ============================================================================

/**
 * Handles POST requests from the landing page form.
 */
function doPost(e) {
  try {
    var params = e.parameter || {};

    // Support both form-urlencoded and JSON payloads
    if (e.postData && e.postData.type === "application/json") {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (err) {
        return jsonResponse({
          status: "error",
          message: "Некоректний JSON у тілі запиту. Invalid JSON payload."
        }, 400);
      }
    }

    // Required fields
    var fullName = String(params.fullName || "").trim();
    var company = String(params.company || "").trim();
    var position = String(params.position || "").trim();
    var email = String(params.email || "").trim();
    var phone = String(params.phone || "").trim();

    // Optional fields
    var industry = String(params.industry || "").trim();
    var colleague = String(params.colleague || "").trim();

    // Validation
    var errors = [];

    if (!fullName) {
      errors.push({ field: "fullName", message: "Будь ласка, вкажіть прізвище та ім'я." });
    }

    if (!company) {
      errors.push({ field: "company", message: "Будь ласка, вкажіть назву компанії." });
    }

    if (!position) {
      errors.push({ field: "position", message: "Будь ласка, вкажіть вашу посаду." });
    }

    if (!email) {
      errors.push({ field: "email", message: "Будь ласка, вкажіть email." });
    } else if (!isValidEmail(email)) {
      errors.push({ field: "email", message: "Некоректний формат email." });
    }

    if (!phone) {
      errors.push({ field: "phone", message: "Будь ласка, вкажіть номер телефону." });
    }

    if (errors.length > 0) {
      return jsonResponse({
        status: "error",
        message: "Будь ласка, заповніть обов'язкові поля правильно.",
        errors: errors
      }, 422);
    }

    // Prepare row data
    var timestamp = new Date();
    var row = [
      timestamp,
      fullName,
      company,
      position,
      email,
      phone,
      industry,
      colleague
    ];

    // Write to sheet
    var sheet = getOrCreateSheet();
    sheet.appendRow(row);

    // Optional: notify admin
    try {
      sendNotification(fullName, company, position, email, phone, industry, colleague);
    } catch (notifyErr) {
      // Notification failure should not break the response
      console.log("Notification failed: " + notifyErr);
    }

    return jsonResponse({
      status: "success",
      message: "Дякуємо за реєстрацію! Ми зв'яжемося з вами найближчим часом.",
      data: {
        fullName: fullName,
        company: company,
        position: position,
        email: email,
        phone: phone,
        industry: industry,
        colleague: colleague
      }
    }, 200);

  } catch (error) {
    console.log("doPost error: " + error + "\nStack: " + error.stack);
    return jsonResponse({
      status: "error",
      message: "Сталася технічна помилка. Спробуйте ще раз пізніше.",
      details: error.toString()
    }, 500);
  }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validates email format.
 *
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ============================================================================
// SHEET HELPERS
// ============================================================================

/**
 * Returns the active spreadsheet. Creates a header row if it does not exist.
 *
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Create headers if the first row is empty
  var headers = [
    "Час реєстрації",
    "Прізвище та ім'я",
    "Назва компанії",
    "Посада",
    "Email",
    "Номер телефону",
    "Сфера діяльності компанії",
    "Участь з колегою"
  ];

  var firstRow = sheet.getRange(1, 1, 1, headers.length);
  var values = firstRow.getValues()[0];

  var hasHeaders = true;
  for (var i = 0; i < headers.length; i++) {
    if (values[i] !== headers[i]) {
      hasHeaders = false;
      break;
    }
  }

  if (!hasHeaders) {
    firstRow.setValues([headers]);
    firstRow.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * Manual helper to initialize sheet headers (run once from the Apps Script editor).
 */
function initSheetHeaders() {
  getOrCreateSheet();
  Logger.log("Sheet headers created/verified.");
}

// ============================================================================
// NOTIFICATION
// ============================================================================

/**
 * Sends a simple email notification to the admin.
 */
function sendNotification(fullName, company, position, email, phone, industry, colleague) {
  if (!ADMIN_EMAIL || ADMIN_EMAIL.indexOf("@") === -1) {
    return;
  }

  var subject = "Нова реєстрація на I-NEX AI — " + fullName;
  var body = [
    "Отримано нову реєстрацію на програму I-NEX AI.",
    "",
    "Прізвище та ім'я: " + fullName,
    "Компанія: " + company,
    "Посада: " + position,
    "Email: " + email,
    "Телефон: " + phone,
    "Сфера діяльності: " + (industry || "—"),
    "Участь з колегою: " + (colleague || "—")
  ].join("\n");

  MailApp.sendEmail(ADMIN_EMAIL, subject, body);
}
