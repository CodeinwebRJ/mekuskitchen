function slugify(productName) {
  return productName
    ?.toLowerCase()
    ?.replace(/[^\w\s-]/g, "") 
    ?.replace(/\s+/g, "-") 
    ?.replace(/-+/g, "-")
    ?.trim();
}

export default slugify;
