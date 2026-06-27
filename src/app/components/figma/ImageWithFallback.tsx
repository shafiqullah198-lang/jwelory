import React, { useEffect, useState } from "react";
import { resolveMediaUrl } from "../../api";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZyIgc3Ryb2tlPSIjOEM3MTIwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjMuNyI+PHJlY3QgeD0iMTYiIHk9IjE2IiB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHJ4PSI2IiBvcGFjaXR5PSIuMzUiLz48cGF0aCBkPSJtMTYgNTggMTYtMTggMzIgMzIiIG9wYWNpdHk9Ii40NSIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciIG9wYWNpdHk9Ii40NSIvPjwvc3ZnPg==";

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(!props.src);

  useEffect(() => {
    setDidError(!props.src);
  }, [props.src]);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setDidError(true);
    props.onError?.(event);
  };

  const { src, alt, style, className, loading, decoding, ...rest } = props;

  return didError ? (
    <div
      className={`inline-flex items-center justify-center overflow-hidden bg-[#f7f1e3] text-center align-middle ${className ?? ""}`}
      style={{
        ...style,
        background: "linear-gradient(135deg, #fbf7ef, #efe4ca)",
      }}
      role="img"
      aria-label={alt ? `${alt} image unavailable` : "Image unavailable"}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img
          className="max-w-[55%] max-h-[55%] opacity-75"
          src={ERROR_IMG_SRC}
          alt=""
          {...rest}
          data-original-url={src}
        />
      </div>
    </div>
  ) : (
    <img
      src={resolveMediaUrl(src)}
      alt={alt}
      className={className}
      style={style}
      loading={loading ?? "lazy"}
      decoding={decoding ?? "async"}
      {...rest}
      onError={handleError}
    />
  );
}
