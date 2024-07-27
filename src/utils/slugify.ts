const slugify = (value: string) => {
  // Replace all non-alphanumeric characters with a underscore
  const slug = value.replace(/[^a-z0-9]+/gi, "_").toLowerCase();

  // Remove leading and trailing hyphens
  return slug.replace(/^-+|-+$/g, "");
};

export default slugify;
