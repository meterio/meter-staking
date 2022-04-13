export const estimateGas = async (provider, from, data) => {
  await provider.estimateGas({
    from,
    data,
    value: 0
  })
}
