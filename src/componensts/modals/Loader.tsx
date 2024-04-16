import "./styles.css";
const ModelLoader = ({ loaderText, type }: any) => {
  return (
    <div className="loader-main-cont">
      <div className="loader-h-w-cont">
        <div className="loader-inner-cont">
          <div className="loader-content-cont">
            {type === "loader" && (
              <img
                src={"img/loader.gif"}
                alt="Loader Image"
                height="80px"
                width="80px"
              />
            )}

            <h2>{loaderText}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelLoader;
