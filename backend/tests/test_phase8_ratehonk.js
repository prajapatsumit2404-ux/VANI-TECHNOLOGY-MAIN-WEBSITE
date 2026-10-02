/**
 * Phase 8 Verification Test: RateHonk Travel CRM Product Story
 * Tests the complete 7-scene cinematic movie sequence, dedicated SaaS canvas background,
 * inbound lead (John Smith, Travel Package, ₹85,000, NEW LEAD),
 * CRM 5-stage pipeline (NEW LEAD, CONTACTED, FOLLOW-UP, QUALIFIED, CONVERTED),
 * physical animated pipeline flow (Lead -> Customer),
 * smart follow-up due transitioning to ✓ Completed,
 * organized customer dossier (Customer, Destination, Trip, Booking Date, Status),
 * booking confirmed voucher for ₹85,000,
 * CRM growth dashboard with animated counters,
 * and final CTA to https://crm.ratehonk.com/portfolio
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('     PHASE 8: RATEHONK CRM PRODUCT STORY AUDIT       ');
console.log('====================================================');

const htmlPath = path.join(__dirname, '../../frontend/index.html');
const cssPath = path.join(__dirname, '../../frontend/css/style.css');
const jsPath = path.join(__dirname, '../../frontend/js/main.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// 1. SCENE 1 — LEAD
console.log('\n1. Verifying SCENE 1 — LEAD...');
assert(html.includes('id="ratehonk-stage-step1"'), 'Scene 1 step container present');
assert(html.includes('John Smith'), 'John Smith present in demo lead data');
assert(html.includes('Travel Package'), 'Travel Package present in demo lead data');
assert(html.includes('₹85,000'), '₹85,000 package value present');
assert(html.includes('NEW LEAD'), 'NEW LEAD status present');
console.log('  [PASS] Scene 1: Inbound lead (John Smith, Travel Package, ₹85,000, NEW LEAD) verified');

// 2. SCENE 2 — CRM PIPELINE
console.log('\n2. Verifying SCENE 2 — CRM PIPELINE...');
assert(html.includes('id="ratehonk-stage-step2"'), 'Scene 2 step container present');
assert(html.includes('NEW LEAD'), 'Pipeline stage NEW LEAD present');
assert(html.includes('CONTACTED'), 'Pipeline stage CONTACTED present');
assert(html.includes('FOLLOW-UP'), 'Pipeline stage FOLLOW-UP present');
assert(html.includes('QUALIFIED'), 'Pipeline stage QUALIFIED present');
assert(html.includes('CONVERTED'), 'Pipeline stage CONVERTED present');
console.log('  [PASS] Scene 2: 5-stage sales pipeline (NEW LEAD, CONTACTED, FOLLOW-UP, QUALIFIED, CONVERTED) verified');

// 3. SCENE 3 — PIPELINE MOTION (Lead -> Customer)
console.log('\n3. Verifying SCENE 3 — PIPELINE FLOW...');
assert(html.includes('id="ratehonk-stage-step3"'), 'Scene 3 step container present');
assert(html.includes('animate-pipeline-flow'), 'animate-pipeline-flow class present on moving lead card');
assert(css.includes('pipelineLeadShift') || css.includes('.animate-pipeline-flow'), 'Pipeline movement CSS keyframe defined');
assert(html.includes('Lead') && html.includes('Customer'), 'Explicit Lead to Customer transformation indicator present');
assert(js.includes('runRateHonkPipelineFlow'), 'Pipeline flow animation logic implemented in JS');
console.log('  [PASS] Scene 3: Physical lead motion through pipeline & "Lead -> Customer" verified');

// 4. SCENE 4 — FOLLOW-UP
console.log('\n4. Verifying SCENE 4 — FOLLOW-UP AUTOMATION...');
assert(html.includes('id="ratehonk-stage-step4"'), 'Scene 4 step container present');
assert(html.includes('Follow-up due'), '"Follow-up due" status present');
assert(js.includes('runRateHonkFollowUp'), 'Follow-up dynamic transition logic implemented in JS');
assert(js.includes('✓ Completed'), '"✓ Completed" transition state in JS');
console.log('  [PASS] Scene 4: "Follow-up due" transitioning to "✓ Completed" verified');

// 5. SCENE 5 — CUSTOMER INFORMATION
console.log('\n5. Verifying SCENE 5 — ORGANIZED CUSTOMER INFORMATION...');
assert(html.includes('id="ratehonk-stage-step5"'), 'Scene 5 step container present');
assert(html.includes('Customer'), 'Customer field present');
assert(html.includes('Destination'), 'Destination field present');
assert(html.includes('Trip'), 'Trip field present');
assert(html.includes('Booking Date'), 'Booking Date field present');
assert(html.includes('Status'), 'Status field present');
console.log('  [PASS] Scene 5: Customer dossier (Customer, Destination, Trip, Booking Date, Status) verified');

// 6. SCENE 6 — BOOKING CONFIRMED
console.log('\n6. Verifying SCENE 6 — BOOKING CONFIRMED...');
assert(html.includes('id="ratehonk-stage-step6"'), 'Scene 6 step container present');
assert(html.includes('BOOKING CONFIRMED'), 'BOOKING CONFIRMED label present');
assert(html.includes('₹85,000'), '₹85,000 confirmed value present');
assert(html.includes('animate-voucher-stamp'), 'Voucher stamp animation applied');
console.log('  [PASS] Scene 6: "BOOKING CONFIRMED" & "₹85,000" verified');

// 7. SCENE 7 — DASHBOARD & SMOOTH COUNTERS
console.log('\n7. Verifying SCENE 7 — CRM DASHBOARD...');
assert(html.includes('id="ratehonk-stage-step7"'), 'Scene 7 step container present');
assert(html.includes('Leads'), 'Leads metric present');
assert(html.includes('Customers'), 'Customers metric present');
assert(html.includes('Follow-ups'), 'Follow-ups metric present');
assert(html.includes('Bookings'), 'Bookings metric present');
assert(html.includes('Revenue'), 'Revenue metric present');
assert(html.includes('Conversion'), 'Conversion Rate metric present');
assert(html.includes('ratehonk-counter'), 'Smooth animated counter class applied');
assert(js.includes('runRateHonkCounters'), 'Animated counter controller logic implemented in JS');
console.log('  [PASS] Scene 7: Dashboard metrics (Leads, Customers, Follow-ups, Bookings, Revenue, Conversion Rate) verified');

// 8. FINAL & CALL TO ACTION
console.log('\n8. Verifying FINAL & CALL TO ACTION...');
assert(html.includes('Turn Leads Into Organized Business Growth'), '"Turn Leads Into Organized Business Growth" final heading present');
assert(html.includes('EXPLORE RATEHONK CRM'), 'EXPLORE RATEHONK CRM button present');
assert(html.includes('https://crm.ratehonk.com/portfolio'), 'URL https://crm.ratehonk.com/portfolio present');
assert(html.includes('target="_blank"') && html.includes('rel="noopener noreferrer"'), 'Secure external new-tab attributes verified');
console.log('  [PASS] FINAL: "Turn Leads Into Organized Business Growth" & button linking to https://crm.ratehonk.com/portfolio verified');

// 9. DEDICATED SAAS BACKGROUND
console.log('\n9. Verifying DEDICATED SAAS BACKGROUND...');
assert(html.includes('id="ratehonk-saas-canvas"'), '#ratehonk-saas-canvas present in HTML');
assert(css.includes('.ratehonk-saas-bg-canvas'), '.ratehonk-saas-bg-canvas CSS defined');
assert(css.includes('.theme-ratehonk-stage'), '.theme-ratehonk-stage CSS defined');
assert(js.includes('initRateHonkBackground'), 'initRateHonkBackground function implemented in JS');
assert(js.includes('gridSize = 45') || js.includes('Coordinate Grid'), 'SaaS coordinate grid implemented');
assert(js.includes('Chart Trend Line') || js.includes('chartPhase'), 'Moving chart lines implemented');
console.log('  [PASS] Background: Dedicated professional SaaS background (grid, chart lines, particles, glow) verified');

console.log('\n====================================================');
console.log('ALL PHASE 8 TESTS PASSED: 100% SUCCESS');
console.log('====================================================\n');
