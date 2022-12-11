import React, { useEffect, useRef } from "react";

function Card(props) {
  const imgRef = useRef(null);

  // 최초에 한번
  useEffect(() => {
    const callback = (entries, observer) => {
      //   console.log("callbacks");

      entries.forEach((entry) => {
        // 화면안에 이 요소가 들어와있냐
        if (entry.isIntersecting) {
          console.log("is intersecting");
          const target = entry.target;
          target.src = target.dataset.src;
          target.previousSibling.srcset = target.previousSibling.dataset.srcset;
          observer.unobserve(target);
        }
      });
    };
    const options = {};
    const observer = new IntersectionObserver(callback, options);
    observer.observe(imgRef.current);
  }, []);

  return (
    <div className="Card text-center">
      <picture>
        {/* 브라우저가 webp를 지원하지 않든 오타가 있든 제대로 렌더링되지 못하면 다음 소스 즉 img의 정보를 로드함 */}
        <source data-srcset={props.webp} type="image/webp" />
        {/* 로드하지 않고 있다가 필요할 때 딱 로드하는 것을 적용하기 위해 보통은 data field를 쓰고 src값은 따로 주지 않음 */}
        <img data-src={props.image} ref={imgRef} alt="" />
      </picture>

      <div className="p-5 font-semibold text-gray-700 text-xl md:text-lg lg:text-xl keep-all">
        {props.children}
      </div>
    </div>
  );
}

export default Card;
