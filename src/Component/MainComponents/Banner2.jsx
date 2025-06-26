import { Link } from "react-router-dom";

function Banner2(props) {
  return (
    <>
      <div
        className="container-fluid page-header py-5"
      >
        <div className="container py-5 text-center">
          <h1 className="display-3 text-white mb-3 animated slideInDown">
            {props.title}
          </h1>
          <div
            style={{ textAlign: "center", width: "100%" }}
            className="homebreadcrumb"
          >
            <Link className="breadcrumb-link" to={props.path}>
              {props.name}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Banner2;
