export const generateSlug = (companyName:string,): string => {
    let slug = companyName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Remove special characters/punctuation
    .replace(/[\s_-]+/g, '-')     // Replace spaces, underscores, and multiple hyphens with a single '-'
    .replace(/^-+|-+$/g, '');     // Trim leading or trailing hyphens

  return slug;
}