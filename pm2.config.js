module.exports = {
  apps:[{
    name:'bff',
    script:'./dist/main.js',
    instances: 2,
    exec_mode: 'cluster',
    node_args: '--max-old-space-size=128',
    env: {
        NODE_ENV: 'development',
    },
    env_production: {
        NODE_ENV: 'production',
    }
  }]
}