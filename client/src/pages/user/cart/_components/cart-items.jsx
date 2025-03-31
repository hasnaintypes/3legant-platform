import CartItem from "./cart-item";

function CartItems({ items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      {items.map((item) => (
        <CartItem key={item._id} item={item} />
      ))}
    </>
  );
}

export default CartItems;
