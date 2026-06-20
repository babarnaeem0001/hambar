import React, { useRef, useState, useEffect } from 'react';

interface SafeHtmlRendererProps {
  html: string;
}

export function SafeHtmlRenderer({ html }: SafeHtmlRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState('250px');

  const updateHeight = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
        if (doc && doc.body) {
          const scrollHeight = doc.body.scrollHeight;
          if (scrollHeight > 0) {
            setHeight(`${scrollHeight + 24}px`);
          }
        }
      } catch (e) {
        // Safe catch for iframe load states
      }
    }
  };

  useEffect(() => {
    updateHeight();
    const interval = setInterval(updateHeight, 500); // Poll height variations dynamically
    return () => clearInterval(interval);
  }, [html]);

  // Restructure internal HTML document to isolate it perfectly and set styling
  const processedHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <base target="_blank">
        <style>
          /* Normalize/Reset styles inside the sandbox */
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 8px 0;
            font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            font-size: 14px;
            line-height: 1.625;
            overflow: hidden;
            height: auto;
            background-color: transparent;
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 12px 0;
          }
          h1, h2, h3, h4, h5, h6 {
            color: #0f172a;
            font-weight: 700;
            letter-spacing: -0.02em;
            margin-top: 24px;
            margin-bottom: 8px;
          }
          h1 { font-size: 24px; }
          h2 { font-size: 20px; }
          h3 { font-size: 16px; }
          p {
            margin: 0 0 12px 0;
          }
          ul, ol {
            margin: 0 0 12px 0;
            padding-left: 20px;
          }
          a {
            color: #2563eb;
            text-decoration: underline;
          }
          a:hover {
            color: #1d4ed8;
          }
          pre, code {
            font-family: monospace;
            background-color: #f1f5f9;
            padding: 2px 4px;
            border-radius: 4px;
            font-size: 13px;
          }
          pre {
            padding: 12px;
            overflow-x: auto;
            margin-bottom: 12px;
          }
          blockquote {
            border-left: 4px solid #cbd5e1;
            padding-left: 16px;
            color: #475569;
            font-style: italic;
            margin: 16px 0;
          }
        </style>
      </head>
      <body>
        <div id="content-container">
          ${html}
        </div>
        <script>
          // Continual height notification to parent frames safely
          function notifyHeight() {
            var el = document.getElementById('content-container');
            if (el) {
              window.parent.postMessage({ 
                type: 'resize-iframe-height', 
                height: el.scrollHeight 
              }, '*');
            }
          }
          window.addEventListener('load', notifyHeight);
          window.addEventListener('resize', notifyHeight);
          
          var observer = new ResizeObserver(notifyHeight);
          observer.observe(document.body);
        </script>
      </body>
    </html>
  `;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'resize-iframe-height') {
        const h = event.data.height;
        if (h && h > 0) {
          setHeight(`${h + 24}px`);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={processedHtml}
      className="w-full border-0 overflow-hidden"
      style={{ height, transition: 'height 0.1s ease' }}
      title="Article Body Content"
      sandbox="allow-scripts"
    />
  );
}
