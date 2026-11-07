import React from 'react';
import fs from 'fs';
import path from 'path';

export default function PublicHomepage() {
  const htmlPath = path.join(
    process.cwd(),
    'stitch_etu_intelligence_digital_twin',
    'etu_intelligence_2027_public_homepage',
    'code.html'
  );

  let rawHtml = fs.readFileSync(htmlPath, 'utf8');

  // Extract body content
  const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : rawHtml;

  // Replace screen placeholders with application routes
  content = content.replace(/\{\{DATA:SCREEN:SCREEN_5\}\}/g, '/auth/login');
  content = content.replace(/\{\{DATA:SCREEN:SCREEN_7\}\}/g, '/auth/login?tab=register');
  content = content.replace(/href="#"/g, 'href="/dashboard"');

  return (
    <div
      className="bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
