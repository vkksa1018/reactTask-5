import axios from "axios";
import { useEffect, useState } from "react";
import { currency } from "../../utiles/filter";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {
  const [cart, setCart] = useState({
    carts: [],
    total: 0,
    final_total: 0,
  });

  const getCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    getCart();
  }, []);
  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const data = {
        data: {
          product_id: productId,
          qty,
        },
      };
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, data);
      getCart();
    } catch (error) {
      console.log(error.response);
    }
  };

  const delCart = async (cartId) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${cartId}`);
      getCart();
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="container">
      <h2>購物車列表</h2>
      <div className="text-end mt-4">
        <button type="button" className="btn btn-outline-danger">
          清空購物車
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th>數量 / 單位</th>
            <th className="text-end">小計</th>
          </tr>
        </thead>

        <tbody>
          {cart.carts.map((item) => (
            <tr key={item.id}>
              <td>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => delCart(item.id)}
                >
                  刪除
                </button>
              </td>
              <td>{item.product.title}</td>
              <td>
                <div className="input-group input-group-sm mb-3">
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    defaultValue={item.qty}
                    onChange={(e) =>
                      updateCart(
                        item.id,
                        item.product_id,
                        Number(e.target.value),
                      )
                    }
                  />
                  <span className="input-group-text" id="inputGroup-sizing-sm">
                    {item.product.unit}
                  </span>
                </div>
              </td>
              <td className="text-end">{currency(item.final_total)}</td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan="3" className="text-end">
              總計
            </td>
            <td className="text-end">{currency(cart.final_total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Cart;
