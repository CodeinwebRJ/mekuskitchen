let userDetail = null;
const getUserDetails = localStorage.getItem("user");

if (getUserDetails) {
  try {
    userDetail = JSON.parse(getUserDetails);
  } catch (error) {
    console.error("Failed to parse user details from localStorage:", error);
  }
}

export default userDetail;
