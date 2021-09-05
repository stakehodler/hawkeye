const addressPrettier = (address?: string) => {
  return (
    <>
      {address?.substr(0, 6)}...
      {address?.substr(address?.length - 6, address?.length)}
    </>
  )
}
export default addressPrettier
