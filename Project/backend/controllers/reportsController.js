const db = require('../database');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

exports.getAllReports = (req, res) => {
  let query = `
    SELECT r.*, i.title as incident_title, u.name as developer_name 
    FROM RCAReports r
    JOIN Incidents i ON r.incident_id = i.id
    JOIN Users u ON r.developer_id = u.id
  `;
  const params = [];

  let conditions = [];

  if (req.query.status) {
    if (req.query.status === 'All') {
      // Do nothing, show all
    } else {
      conditions.push('r.status = ?');
      params.push(req.query.status);
    }
  } else if (req.query.approved === 'true') {
    conditions.push("r.status = 'Approved' OR r.approved = 1");
  } else if (req.user.role === 'IT Manager') {
    conditions.push("r.status IN ('Submitted', 'Pending Review', 'Approved', 'Rejected')");
  }

  if (req.user.role === 'Developer') {
    conditions.push('r.developer_id = ?');
    params.push(req.user.id);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY r.created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
};

exports.getReportById = (req, res) => {
  const query = `
    SELECT r.*, i.title as incident_title, u.name as developer_name 
    FROM RCAReports r
    JOIN Incidents i ON r.incident_id = i.id
    JOIN Users u ON r.developer_id = u.id
    WHERE r.incident_id = ?
  `;
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      console.error(`[Backend Log] Database error retrieving report for Incident ID ${req.params.id}:`, err);
      return res.status(500).json({ error: `Database error: ${err.message}` });
    }
    if (!row) {
      console.warn(`[Backend Log] Report not found for Incident ID: ${req.params.id}`);
      return res.status(404).json({ error: `Report for Incident ID ${req.params.id} not found.` });
    }
    console.log(`[Backend Log] Report retrieved successfully for Incident ID: ${req.params.id}`);
    res.json(row);
  });
};

const generatePDF = (report) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const parseMarkdown = (markdownStr) => {
      const sections = {};
      if (!markdownStr) return sections;
      const chunks = markdownStr.split(/(?=\n#\s)/);
      chunks.forEach(chunk => {
        const match = chunk.match(/^\n?#\s+(.+)\n([\s\S]*)$/);
        if (match) {
          const title = match[1].trim().toLowerCase();
          const content = match[2].trim();
          if (title.includes('incident summary')) sections.summary = content;
          if (title.includes('timeline')) sections.timeline = content;
          if (title.includes('error')) sections.errors = content;
          if (title.includes('git diff')) sections.gitDiff = content;
          if (title.includes('root cause')) sections.rootCause = content;
          if (title.includes('impact')) sections.impact = content;
          if (title.includes('recommended fixes') || title.includes('fixes')) sections.fixes = content;
          if (title.includes('prevention')) sections.prevention = content;
        }
      });
      return sections;
    };

    const sections = parseMarkdown(report.markdown_report);

    // --- UTILS ---
    const drawGrid = (x, y, w, h) => {
      doc.rect(x, y, w, h).stroke();
    };
    
    const drawLabelValue = (x, y, label, value, width, height) => {
      drawGrid(x, y, width, height);
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000').text(label, x + 5, y + 5);
      doc.fontSize(10).font('Helvetica').text(value || 'N/A', x + 5, y + 18, { width: width - 10, height: height - 20, ellipsis: true });
    };

    const drawSectionHeader = (x, y, title, width, height = 20) => {
      doc.rect(x, y, width, height).fillAndStroke('#E5E7EB', '#000000');
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000').text(title.toUpperCase(), x + 5, y + 5);
    };

    const drawTextArea = (x, y, width, height, text) => {
      drawGrid(x, y, width, height);
      doc.fontSize(10).font('Helvetica').fillColor('#000000').text(text || '', x + 5, y + 5, { width: width - 10, height: height - 10, ellipsis: true });
    };

    let startY = 40;
    const cw = doc.page.width - 80; // 515.28

    // 1. Root Cause Analysis Report Header
    doc.fontSize(18).font('Helvetica-Bold').text('ROOT CAUSE ANALYSIS (RCA) REPORT', 40, startY, { align: 'center', width: cw });
    startY += 30;

    // 2. Organization Information
    drawSectionHeader(40, startY, 'Organization Information', cw);
    startY += 20;
    drawLabelValue(40, startY, 'Agency:', 'IncidentIQ Platform', cw / 2, 40);
    drawLabelValue(40 + cw / 2, startY, 'Reference Number:', report.incident_id || 'N/A', cw / 2, 40);
    startY += 40;
    drawLabelValue(40, startY, 'Program / Facility:', 'Platform Engineering', cw / 2, 40);
    drawLabelValue(40 + cw / 2, startY, 'Region:', 'Global', cw / 2, 40);
    startY += 40;
    drawLabelValue(40, startY, 'Consumer Details:', 'Internal System Services', cw / 2, 40);
    drawLabelValue(40 + cw / 2, startY, 'Date of Event:', new Date(report.created_at).toLocaleDateString(), cw / 4, 40);
    drawLabelValue(40 + 3 * cw / 4, startY, 'Completion Date:', new Date(report.created_at).toLocaleDateString(), cw / 4, 40);
    startY += 40;

    // 3. Event Details
    drawSectionHeader(40, startY, 'Event Details', cw);
    startY += 20;
    drawLabelValue(40, startY, 'Event Description:', report.incident_title || 'Service Disruption', cw, 40);
    startY += 40;
    drawLabelValue(40, startY, 'RCA Team Members:', 'Automated AI Agent, ' + (report.developer_name || 'Developer'), cw / 2, 40);
    drawLabelValue(40 + cw / 2, startY, 'Team Leader:', report.developer_name || 'System Admin', cw / 2, 40);
    startY += 40;

    // 4. Background Summary
    drawSectionHeader(40, startY, 'Background Summary', cw);
    startY += 20;
    drawTextArea(40, startY, cw, 60, sections.summary ? sections.summary.replace(/^[-*•]\s*/gm, '') : 'No background summary provided.');
    startY += 60;

    // 5. Expected Sequence Questions
    drawSectionHeader(40, startY, 'Expected Sequence Questions', cw);
    startY += 20;
    drawTextArea(40, startY, cw, 60, "Q: Was the system functioning normally prior to the event?\nA: Yes.\nQ: Were there any planned deployments or changes?\nA: Investigation of recent git commits shows modifications.");
    startY += 60;

    // 6. Deviation Analysis
    drawSectionHeader(40, startY, 'Deviation Analysis', cw);
    startY += 20;
    drawTextArea(40, startY, cw, 70, sections.errors ? sections.errors.replace(/^[-*•]\s*/gm, '') : 'No deviations logged.');
    startY += 70;

    // Move to next page for the rest to keep it clean
    doc.addPage();
    startY = 40;

    // 7. Contribution Analysis
    drawSectionHeader(40, startY, 'Contribution Analysis', cw);
    startY += 20;
    drawTextArea(40, startY, cw, 60, sections.impact ? sections.impact.replace(/^[-*•]\s*/gm, '') : 'No impact recorded.');
    startY += 60;

    // 8. Policy / Procedure Analysis
    drawSectionHeader(40, startY, 'Policy / Procedure Analysis', cw);
    startY += 20;
    drawTextArea(40, startY, cw, 80, sections.gitDiff ? 'Code changes detected:\n' + sections.gitDiff : 'No related code changes found.');
    startY += 80;

    // 9. Root Cause Findings
    drawSectionHeader(40, startY, 'Root Cause Findings', cw);
    startY += 20;
    drawTextArea(40, startY, cw, 100, sections.rootCause ? sections.rootCause.replace(/^[-*•]\s*/gm, '') : 'Unknown root cause.');
    startY += 100;

    // 10. Corrective Actions
    drawSectionHeader(40, startY, 'Corrective Actions', cw);
    startY += 20;
    drawTextArea(40, startY, cw, 100, sections.fixes ? sections.fixes.replace(/^[-*•]\s*/gm, '') : 'No corrective actions listed.');
    startY += 100;

    // 11. Recommendations
    drawSectionHeader(40, startY, 'Recommendations', cw);
    startY += 20;
    drawTextArea(40, startY, cw, 100, sections.prevention ? sections.prevention.replace(/^[-*•]\s*/gm, '') : 'No preventive recommendations listed.');
    startY += 100;

    // Move to next page if needed
    if (startY > doc.page.height - 200) {
      doc.addPage();
      startY = 40;
    }

    // 12. Approval Section
    drawSectionHeader(40, startY, 'Approval Section', cw);
    startY += 20;
    drawGrid(40, startY, cw, 80);
    doc.fontSize(9).font('Helvetica-Bold').text('Preparer Name:', 50, startY + 10);
    doc.font('Helvetica').text(report.developer_name || 'System Generated', 150, startY + 10);
    
    doc.font('Helvetica-Bold').text('Signature:', 50, startY + 30);
    doc.moveTo(150, startY + 40).lineTo(300, startY + 40).stroke();
    
    doc.font('Helvetica-Bold').text('Date:', 350, startY + 30);
    doc.moveTo(390, startY + 40).lineTo(480, startY + 40).stroke();

    doc.font('Helvetica-Bold').text('Approver Name:', 50, startY + 50);
    doc.font('Helvetica').text('Pending Manager Review', 150, startY + 50);
    
    doc.font('Helvetica-Bold').text('Signature:', 50, startY + 70);
    doc.moveTo(150, startY + 80).lineTo(300, startY + 80).stroke();
    
    doc.font('Helvetica-Bold').text('Date:', 350, startY + 70);
    doc.moveTo(390, startY + 80).lineTo(480, startY + 80).stroke();

    doc.end();
  });
};

exports.downloadPdf = (req, res) => {
  db.get('SELECT r.*, i.title as incident_title FROM RCAReports r JOIN Incidents i ON r.incident_id = i.id WHERE r.incident_id = ?', [req.params.id], async (err, report) => {
    if (err || !report) return res.status(404).json({ error: 'Report not found' });

    try {
      const pdfBuffer = await generatePDF(report);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=RCA_Report_${req.params.id}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });
};

exports.emailReport = (req, res) => {
  const { to, subject, message } = req.body;

  db.get('SELECT r.*, i.title as incident_title FROM RCAReports r JOIN Incidents i ON r.incident_id = i.id WHERE r.incident_id = ?', [req.params.id], async (err, report) => {
    if (err || !report) return res.status(404).json({ error: 'Report not found' });

    try {
      const pdfBuffer = await generatePDF(report);

      const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_MAIL', 'SMTP_PASS'];
      const missingVars = requiredEnvVars.filter(key => !process.env[key]);
      
      if (missingVars.length > 0) {
        return res.status(500).json({ 
          error: `Failed to transmit. Missing SMTP credentials: ${missingVars.join(', ')}` 
        });
      }

      let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.SMTP_MAIL,
        to,
        subject,
        text: message,
        attachments: [
          {
            filename: `RCA_Report_${req.params.id}.pdf`,
            content: pdfBuffer
          }
        ]
      });

      res.json({ message: 'Intelligence transmitted successfully' });
    } catch (error) {
      console.error('Email error:', error);
      res.status(500).json({ error: `Failed to transmit: ${error.message}` });
    }
  });
};

exports.submitReport = (req, res) => {
  const { name, email, team, notes } = req.body;
  
  if (!name || !email || !team) {
    return res.status(400).json({ error: 'Name, Email, and Team are required fields.' });
  }

  const query = `
    UPDATE RCAReports 
    SET status = 'Submitted', 
        submit_name = ?, 
        submit_email = ?, 
        submit_team = ?, 
        submit_notes = ?, 
        submitted_at = CURRENT_TIMESTAMP 
    WHERE incident_id = ? AND developer_id = ?
  `;
  
  db.run(query, [name, email, team, notes || '', req.params.id, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Report not found or not authorized' });
    res.json({ message: 'Submitted successfully' });
  });
};

exports.deleteReport = (req, res) => {
  if (req.user.role !== 'Developer') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  db.run('DELETE FROM RCAReports WHERE incident_id = ? AND developer_id = ?', [req.params.id, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Report not found or not authorized' });
    
    db.run('DELETE FROM Incidents WHERE id = ?', [req.params.id]);
    
    res.json({ message: 'Report deleted permanently' });
  });
};

exports.approveReport = (req, res) => {
  if (req.user.role !== 'IT Manager') return res.status(403).json({ error: 'Unauthorized' });
  
  const { comment } = req.body;
  const managerName = req.user.name || 'Manager';
  db.run("UPDATE RCAReports SET status = 'Approved', approved = 1, manager_comment = ?, manager_name = ?, reviewed_at = CURRENT_TIMESTAMP WHERE incident_id = ?", [comment || '', managerName, req.params.id], function(err) {
    if (err) {
      console.error('[Approve Error]', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ message: 'Report approved' });
  });
};

exports.rejectReport = (req, res) => {
  if (req.user.role !== 'IT Manager') return res.status(403).json({ error: 'Unauthorized' });
  
  const { comment } = req.body;
  const managerName = req.user.name || 'Manager';
  if (!comment) return res.status(400).json({ error: 'Reason required for rejection' });
  db.run("UPDATE RCAReports SET status = 'Rejected', approved = 0, manager_comment = ?, manager_name = ?, reviewed_at = CURRENT_TIMESTAMP WHERE incident_id = ?", [comment, managerName, req.params.id], function(err) {
    if (err) {
      console.error('[Reject Error]', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ message: 'Report rejected' });
  });
};

exports.markNotified = (req, res) => {
  if (req.user.role !== 'Developer') return res.status(403).json({ error: 'Unauthorized' });
  db.run("UPDATE RCAReports SET notified = 1 WHERE incident_id = ? AND developer_id = ?", [req.params.id, req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Marked as notified' });
  });
};
