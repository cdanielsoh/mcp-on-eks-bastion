module.exports = {
  apps: [
    {
      name: 'chainlit-backend',
      cwd: './backend',
      script: 'python -m chainlit run app.py',
      args: '--host 0.0.0.0 --port 8000',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'react-frontend',
      cwd: './frontend',
      script: 'node server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 80,
      },
    },
  ],
};