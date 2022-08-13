export const urlIdentifier = (url: string): 'shopee' | 'tokopedia' => {
  const { host } = new URL(url)
  if (host.includes('tokopedia')) return 'tokopedia'
  return 'shopee'
}