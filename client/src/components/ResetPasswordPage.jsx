// ResetPasswordPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import ResetPasswordForm from "./ResetPasswordForm"; // Make sure the path is correct

function ResetPasswordPage() {
  const { token } = useParams(); // Extract the token from the URL

  return (
    <div>
      {/* You can include additional layout or content here */}
      <ResetPasswordForm token={token} />{" "}
      {/* Pass the token as a prop to ResetPasswordForm */}
    </div>
  );
}

export default ResetPasswordPage;
