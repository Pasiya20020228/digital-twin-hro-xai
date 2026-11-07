const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'stitch_etu_intelligence_digital_twin', 'etu_intelligence_2027_public_homepage', 'code.html');
const raw = fs.readFileSync(srcPath, 'utf8');

// Extract body
const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
if (!bodyMatch) {
  console.error('No body found');
  process.exit(1);
}

let body = bodyMatch[1];

// Replace placeholders
body = body.replace(/\{\{DATA:SCREEN:SCREEN_5\}\}/g, '/auth/login');
body = body.replace(/\{\{DATA:SCREEN:SCREEN_7\}\}/g, '/auth/register');

// Replace class with className
body = body.replace(/\sclass="/g, ' className="');
body = body.replace(/\sclass='/g, " className='");

// Replace for with htmlFor
body = body.replace(/\sfor="/g, ' htmlFor="');
body = body.replace(/\sfor='/g, " htmlFor='");

// Replace style attributes with style objects
body = body.replace(/style="([^"]*)"/g, (match, p1) => {
  const rules = p1.split(';').map(r => r.trim()).filter(Boolean);
  const styleObj = {};
  rules.forEach(rule => {
    const colonIdx = rule.indexOf(':');
    if (colonIdx > -1) {
      const prop = rule.substring(0, colonIdx).trim();
      const val = rule.substring(colonIdx + 1).trim();
      // camelCase property
      const camelProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      styleObj[camelProp] = val;
    }
  });
  return `style={${JSON.stringify(styleObj)}}`;
});

// Self-close void elements
const voidTags = ['input', 'img', 'br', 'hr', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon'];
voidTags.forEach(tag => {
  const regex = new RegExp(`<(${tag}[^>]*?)(?<!\\/)>`, 'gi');
  body = body.replace(regex, '<$1 />');
});

// Fix unescaped entities
body = body.replace(/&times;/g, '×');
body = body.replace(/&copy;/g, '©');
body = body.replace(/&rarr;/g, '→');
body = body.replace(/&larr;/g, '←');

// Wrap in React component
const componentCode = `'use client';

import React from 'react';
import Link from 'next/link';

export default function PublicHomepage() {
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen">
      ${body}
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'app', 'page.tsx'), componentCode, 'utf8');
console.log('PublicHomepage converted successfully!');

