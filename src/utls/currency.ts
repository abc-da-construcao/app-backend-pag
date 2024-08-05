export function formatAmountPagSeguro(value: number) {
  const valorDecimais = value.toFixed(2);
  const valorSemFormatacao = valorDecimais.replace(/[\.,]/g, '');
  const valorEmCentavos = parseInt(valorSemFormatacao);
  return valorEmCentavos;
}
