export const generateNextInvoiceNumber = (lastNumber) => {
  const currentYear = new Date().getFullYear();
console.log('*************',lastNumber);

  // If no previous invoice, start with INVYYYY001
  if (!lastNumber) {
    return `INV${currentYear}001`;
  }

  // Extract parts from the last invoice number (e.g., "INV2024005")
  const regex = /^INV(\d{4})(\d{3})$/;
  console.log('regex:',regex);
  
  const match = lastNumber.match(regex);
console.log(match);

  // Handle invalid formats (reset counter)
  if (!match) {
    return `INV${currentYear}001`;
  }

  const [lastYear, lastCounter] = match;
  let nextCounter;

  // Reset counter if year changed
  if (parseInt(lastYear) !== currentYear) {
    nextCounter = 1;
  } else {
    nextCounter = parseInt(lastCounter) + 1;
  }

  // Format with leading zeros
  return `INV${currentYear}${nextCounter.toString().padStart(3, '0')}`;
};