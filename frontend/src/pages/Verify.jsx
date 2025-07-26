import Loading from "../components/Loading.jsx";
import VerifyOtp from "../components/VerifyOtp.jsx";
import { Suspense } from "react";

const VerifyPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyOtp />
    </Suspense>
  );
};

export default VerifyPage;
