export function debounce(cb: () => void, delay: number): () => void {
    let timeout: NodeJS.Timeout;
    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cb();
        }, delay);
    };
}
