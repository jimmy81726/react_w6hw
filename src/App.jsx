import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";
import ReactLoading from "react-loading";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [carts, setCarts] = useState([]);
  const [total, setTotal] = useState("");
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState([]);
  const [qtySelect, setQtySelect] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
        setProducts(res.data.products);
      } catch (error) {
        console.error("發生錯誤:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);

  const productModalRef = useRef(null);
  useEffect(() => {
    new Modal(productModalRef.current, { backdrop: false });
  }, []);

  const openModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };

  const closeModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    setQtySelect(1);
    modalInstance.hide();
  };

  const handleSeeMore = (product) => {
    setTempProduct(product);
    openModal();
  };

  // 產品加入購物車
  const addCart = async (product, qty = 1) => {
    try {
      setIsBtnLoading(true);
      setIsLoading(true);
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: {
          product_id: product.id,
          qty: Number(qty),
        },
      });
      getCart();
      closeModal();
    } catch (error) {
      console.error("發生錯誤:", error);
    } finally {
      setIsLoading(false);
      setIsBtnLoading(false);
    }
  };
  // 渲染購物車
  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      console.log(carts);

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

  // 一開始渲染購物車
  useEffect(() => {
    getCart();
  }, []);

  return (
    <div className="container">
      <div className="mt-4">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ width: "200px" }}>
                  <img
                    className="img-fluid"
                    src={product.imageUrl}
                    alt={product.title}
                  />
                </td>
                <td>{product.title}</td>
                <td>
                  <del className="h6">原價 {product.origin_price} 元</del>
                  <div className="h5">特價 {product.price}元</div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button
                      onClick={() => handleSeeMore(product)}
                      type="button"
                      className="btn btn-outline-secondary"
                    >
                      查看更多
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => addCart(product)}
                    >
                      加到購物車
                      {isBtnLoading && (
                        <ReactLoading
                          type={"spin"}
                          color={"#000"}
                          height={"1.5rem"}
                          width={"1.5rem"}
                        />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          ref={productModalRef}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          className="modal fade"
          id="productModal"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5">
                  產品名稱：{tempProduct.title}
                </h2>
                <button
                  onClick={closeModal}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={tempProduct.imageUrl}
                  alt={tempProduct.title}
                  className="img-fluid"
                />
                <p>內容：{tempProduct.content}</p>
                <p>描述：{tempProduct.description}</p>
                <p>
                  價錢：{tempProduct.price}{" "}
                  <del>{tempProduct.origin_price}</del> 元
                </p>
                <div className="input-group align-items-center">
                  <label htmlFor="qtySelect">數量：</label>
                  <select
                    value={qtySelect}
                    onChange={(e) => {
                      setQtySelect(e.target.value);
                    }}
                    id="qtySelect"
                    className="form-select"
                  >
                    {Array.from({ length: 10 }).map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={isBtnLoading}
                  onClick={() => addCart(tempProduct, qtySelect)}
                >
                  加入購物車
                  {isBtnLoading && (
                    <ReactLoading
                      type={"spin"}
                      color={"#000"}
                      height={"1.5rem"}
                      width={"1.5rem"}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

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
      </div>

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
      </div>

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
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      )}
    </div>
  );
}

export default App;
