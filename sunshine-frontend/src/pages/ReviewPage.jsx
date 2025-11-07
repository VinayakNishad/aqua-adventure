// pages/ReviewPage.js
import { useParams, useLocation } from "react-router-dom";
import ReviewForm from "../components/ReviewForm";

const ReviewPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const isPackage = location.pathname.includes("/package/");

  return isPackage ? (
    <ReviewForm packageId={id} />
  ) : (
    " Invalid URL"
  );
};

export default ReviewPage;
