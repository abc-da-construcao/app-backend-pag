export async function merge(array1: any, array2: any) {
  return array1.concat(array2).reduce((acc: any, item: any) => {
    const existingItem = acc.find((existing: any) => existing.referencia === item.referencia);

    if (!existingItem) {
      acc.push({ ...item }); // Add unique item
    } else {
      // Merge properties if they differ
      existingItem.url = item.url || existingItem.url;
      existingItem.url_catalogo = item.url_catalogo || existingItem.url_catalogo;
    }

    // Return the updated accumulator
    return acc;
  }, []);
}
