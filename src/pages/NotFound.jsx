import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 設定 3 秒後跳轉回首頁
    const timer = setTimeout(() => {
      navigate("/"); // 回到首頁
    }, 3000); // 3秒後自動回首頁

    // 清理定時器
    return () => clearTimeout(timer);
  }, [navigate]);
  return <h1>介面不存在,將回首頁..</h1>;
};

export default NotFound;
