module.exports = {
  apps:[{
    name:'bff',
    script:'./dist/main.js',
    instances: 0,
    exec_mode: 'cluster',
    node_args: '--max-old-space-size=512'
  }]
}