import { useEffect, useState } from "react";
import axios from "axios";

import ReactLoading from "react-loading";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const ProductList = () => {
  // 渲染購物車
  const [isLoading, setIsLoading] = useState(false);

  const [isBtnLoading, setIsBtnLoading] = useState(false);

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
    } catch (error) {
      console.error("發生錯誤:", error);
    } finally {
      setIsLoading(false);
      setIsBtnLoading(false);
    }
  };
  const [products, setProducts] = useState([]);

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
                    <Link
                      type="button"
                      className="btn btn-outline-secondary"
                      to={product.id}
                    >
                      查看更多
                    </Link>
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
};
export default ProductList;
