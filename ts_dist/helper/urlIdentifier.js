export const urlIdentifier = (url) => {
    const { host } = new URL(url);
    if (host.includes('tokopedia'))
        return 'tokopedia';
    return 'shopee';
};
