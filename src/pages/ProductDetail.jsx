import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);
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
  useEffect(() => {
    const getDetail = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/v2/api/${API_PATH}/product/${id}`
        );

        setProduct(res.data.product);
      } catch (error) {
        console.error("發生錯誤:", error);
      }
    };
    getDetail();
  }, [id]);

  return (
    <>
      <div className="container mt-5" key={product.id}>
        <div className="row">
          <div className="col-6">
            <img
              className="img-fluid"
              src={product.imageUrl}
              alt={product.title}
            />
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center gap-2">
              <h2>{product.title}</h2>
              <span className="badge text-bg-success">{product.category}</span>
            </div>
            <p className="mb-3">{product.description}</p>
            <p className="mb-3">{product.content}</p>
            <h5 className="mb-3">NT$ {product.price}</h5>
            <div className="input-group align-items-center w-75">
              <select
                value={qtySelect}
                onChange={(e) => setQtySelect(e.target.value)}
                id="qtySelect"
                className="form-select"
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  addCart(product, qtySelect);
                  setQtySelect(1);
                }}
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
export default ProductDetail;
