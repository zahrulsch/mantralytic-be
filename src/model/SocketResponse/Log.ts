export interface Log {
  type: 'crawler' | 'connection' | '';
  url: string;
  marketplaceType: 'shopee' | 'tokopedia' | '';
  status: 'success' | 'error';
  title: string;
}