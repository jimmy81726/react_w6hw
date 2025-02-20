import { useEffect, useState } from "react";
import axios from "axios";

import { useForm } from "react-hook-form";
import ReactLoading from "react-loading";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const Carts = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [carts, setCarts] = useState([]);
  const [total, setTotal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkout = async (data) => {
    try {
      setIsLoading(true);
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, data);
      // 結帳完會清空購物車,要重新渲染
      getCart();

      alert("結帳成功");
    } catch (error) {
      alert("結帳失敗");
      console.error("發生錯誤:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 更新購物車數量
  const updateCart = async (cart, qty) => {
    try {
      setIsLoading(true);
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cart.id}`, {
        data: {
          product_id: cart.product_id,
          qty: qty,
        },
      });
      getCart();
    } catch (error) {
      console.error("發生錯誤:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 送出訂單
  const onSubmit = handleSubmit((data) => {
    const { message, ...user } = data;

    const userInfo = {
      data: {
        user: user,
        message: message,
      },
    };

    checkout(userInfo);
    reset();
  });

  // 刪除單一品項
  const delCart = async (product_id) => {
    try {
      setIsLoading(true);
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${product_id}`);
      getCart();
    } catch (error) {
      console.error("發生錯誤:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // 渲染購物車
  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);

      setCarts(res.data.data.carts);
      setTotal(res.data.data.final_total);
    } catch (error) {
      console.error("發生錯誤:", error);
    }
  };

  // 刪除購物車
  const delAllCart = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      getCart();
    } catch (error) {
      console.error("發生錯誤:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // 一開始渲染購物車
  useEffect(() => {
    getCart();
  }, []);
  return (
    <>
      <div className="text-end py-3">
        <button
          className="btn btn-outline-danger"
          type="button"
          onClick={delAllCart}
        >
          清空購物車
        </button>
      </div>

      <table className="table align-middle">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th style={{ width: "150px" }}>數量/單位</th>
            <th className="text-end">單價</th>
          </tr>
        </thead>
        {carts.map((cart) => (
          <tbody key={cart.id}>
            <tr>
              <td>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => delCart(cart.id)}
                >
                  x
                </button>
              </td>
              <td>{cart.product.title}</td>
              <td style={{ width: "150px" }}>
                <div className="d-flex align-items-center">
                  <div className="btn-group me-2" role="group">
                    <button
                      type="button"
                      className={`btn btn-outline-dark btn-sm ${
                        cart.qty === 1 && "disabled"
                      }`}
                      onClick={() => updateCart(cart, cart.qty - 1)}
                    >
                      -
                    </button>
                    <span
                      className="btn border border-dark"
                      style={{ width: "50px", cursor: "auto" }}
                    >
                      {cart.qty}
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => updateCart(cart, cart.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="input-group-text bg-transparent border-0">
                    單位
                  </span>
                </div>
              </td>
              <td className="text-end">{cart.product.price * cart.qty}</td>
            </tr>
          </tbody>
        ))}
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end">
              總計：{total}
            </td>
            <td className="text-end" style={{ width: "130px" }}></td>
          </tr>
        </tfoot>
      </table>
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email 欄位必填",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email 格式錯誤",
                },
              })}
              id="email"
              type="email"
              className={`form-control ${errors.email && "is-invalid"}`}
              //
              placeholder="請輸入 Email"
            />

            {errors.email && (
              <p className="text-danger my-2">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              {...register("name", {
                required: "姓名為必填",
              })}
              id="name"
              className={`form-control ${errors.name && "is-invalid"}`}
              placeholder="請輸入姓名"
            />

            {errors.name && (
              <p className="text-danger my-2">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              {...register("tel", {
                required: "電話為必填",
                pattern: {
                  value: /^(0[2-8]\d{7}|09\d{8})$/,
                  message: "電話格式錯誤",
                },
              })}
              id="tel"
              type="text"
              className={`form-control ${errors.tel && "is-invalid"}`}
              placeholder="請輸入電話"
            />

            {errors.tel && (
              <p className="text-danger my-2">{errors.tel.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              {...register("address", {
                required: "地址為必填",
              })}
              id="address"
              type="text"
              className={`form-control ${errors.address && "is-invalid"}`}
              placeholder="請輸入地址"
            />

            {errors.address && (
              <p className="text-danger my-2">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              {...register("message")}
              id="message"
              className="form-control"
              cols="30"
              rows="10"
            ></textarea>
          </div>
          <div className="text-end">
            <button
              type="submit"
              className={`btn btn-danger ${carts.length == 0 && "disabled"}`}
            >
              送出訂單
            </button>
          </div>
        </form>
        {isLoading && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(255,255,255,0.3)",
              zIndex: 999,
            }}
          >
            <ReactLoading
              type="spin"
              color="black"
              width="4rem"
              height="4rem"
            />
          </div>
        )}
      </div>
    </>
  );
};
export default Carts;
