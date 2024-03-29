import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import axios from 'axios';
import { toast } from 'react-toastify';

function POSpage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoadind] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchProducts = async () => {
    setIsLoadind(true);
    const result = await axios.get('products');
    setProducts(await result.data);
    setIsLoadind(false);
  };

  const addProductToCart = async (product) => {
    //check if the product exists => true false ekak enneh
    let findProductInCart = await cart.find((i) => {
      return i.id === product.id;
    });

    if (findProductInCart) {
      let newCart = [];
      let newItem;

      cart.forEach((cartItem) => {
        if (cartItem.id === product.id) {
          newItem = {
            ...cartItem,
            quantity: cartItem.quantity + 1,
            totalAmount: cartItem.price * (cartItem.quantity + 1),
          };
          newCart.push(newItem);
        } else {
          newCart.push(cartItem);
        }
      });

      setCart(newCart);
      toast(`Added ${newItem.name} to cart`);
    } else {
      let addingProduct = {
        ...product,
        quantity: 1,
        totalAmount: product.price,
      };
      setCart([...cart, addingProduct]);
      toast(`Added ${product.name} to cart`);
    }
  };

  const removeProduct = async (product) => {
    const newCart = cart.filter((cartItem) => cartItem.id !== product.id);
    setCart(newCart);
  };

  useEffect(() => {
    let newTotalAmount = 0;
    cart.forEach((icart) => {
      newTotalAmount = newTotalAmount + parseInt(icart.totalAmount);
    });
    setTotalAmount(newTotalAmount);
  }, [cart]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <MainLayout>
      <div className="row">
        <div className="col-lg-8">
          {isLoading ? (
            'Loading...'
          ) : (
            <div className="row">
              {products.map((product, key) => (
                <div key={key} className="col-lg-4">
                  <div
                    className="border"
                    onClick={() => {
                      addProductToCart(product);
                    }}
                  >
                    <p>{product.name}</p>
                    <img
                      src={product.image}
                      className="img-fluid"
                      alt={product.name}
                    />
                    <p>${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="tabl-responsive bg-dark">
            <table className="table table-responsive table-dark">
              <thead>
                <tr>
                  <td>#</td>
                  <td>Name</td>
                  <td>Price</td>
                  <td>Qty</td>
                  <td>Total</td>
                  <td>Action</td>
                </tr>
              </thead>

              <tbody>
                {cart
                  ? cart.map((cartProduct, key) => (
                      <tr key={key}>
                        <td>{cartProduct.id}</td>
                        <td>{cartProduct.name}</td>
                        <td>{cartProduct.price}</td>
                        <td>{cartProduct.quantity}</td>
                        <td>{cartProduct.totalAmount}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => removeProduct(cartProduct)}
                          >
                            Remove{' '}
                          </button>
                        </td>
                      </tr>
                    ))
                  : 'No items on the card'}
              </tbody>
            </table>

            <h2 className="px-2 text-white"> Total Amount: ${totalAmount}</h2>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default POSpage;
