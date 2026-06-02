'use client';

import { useMemo } from 'react';

interface CodePreviewProps {
  code: string;
  framework: string;
}

export default function CodePreview({ code, framework }: CodePreviewProps) {
  const htmlContent = useMemo(() => {
    if (framework === 'react') {
      // For React, we wrap in a basic HTML page with Babel standalone for transpilation
      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${code}
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));
  </script>
</body>
</html>`;
    }

    if (framework === 'vue') {
      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
</head>
<body>
  <div id="app">
    ${code.replace(/<template>([\s\S]*?)<\/template>/, '$1').replace(/<script[\s\S]*?<\/script>/, '')}
  </div>
  <script>
    ${code.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/)?.[1] || ''}
    Vue.createApp(${code.includes('setup') ? '{}' : '{}'}).mount('#app');
  </script>
</body>
</html>`;
    }

    // HTML / Tailwind — direct injection
    return code;
  }, [code, framework]);

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
        <div className="text-center space-y-2">
          <div className="text-4xl">👀</div>
          <p className="text-sm">上传截图并点击生成后，预览将显示在这里</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={htmlContent}
      className="w-full h-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white"
      title="Code Preview"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
