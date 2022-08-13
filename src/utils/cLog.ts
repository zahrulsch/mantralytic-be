export default function cLog(msg: any = '', type: 'info' | 'error' | 'warning' | 'success' = 'info') {
  const colors = {
    info: "[INFO] \x1b[36m%s\x1b[0m",
    error: "[ERROR] \x1b[31m%s\x1b[0m",
    warning: "[WARNING] \x1b[33m%s\x1b[0m",
    success: "[SUCCESS] \x1b[32m%s\x1b[0m"
  }
  console.log(colors[type], msg)
}