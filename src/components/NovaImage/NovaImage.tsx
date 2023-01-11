import ApiFactory from "@/API/controllers/api-factory";
import FilesApi from "@/API/controllers/files-api";
import React, { useEffect, useState } from "react";

/**
 * Imported from Material-component
 * URL : https://github.com/material-components/material-components-web-react/blob/master/packages/text-field/Input.tsx
 */
export interface NovaImageProps {
  className?: string;
  fileId: string;
  alt?: string;
  fallBackTemplate?;
}

const NovaImage = ({
  className,
  fileId,
  alt,
  fallBackTemplate,
}: NovaImageProps) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>("");
  const [, setUseFallback] = useState<boolean>(false);

  const onLoadError = () => {
    setUseFallback(true);
  };

  const loadImage = async (fileId: string) => {
    try {
      const apiClient = ApiFactory.create<FilesApi>("FilesApi");
      const data = await apiClient.getFile(fileId);
      const imgUrl = URL.createObjectURL(data);
      setImgSrc(imgUrl);
    } catch (err) {
      onLoadError();
    }
  };

  useEffect(() => {
    if (fileId) {
      loadImage(fileId);
    } else {
      setImgSrc(undefined);
    }
  }, [fileId]);

  return (
    <>
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={alt}
          className={className}
          data-id={fileId}
          onError={onLoadError}
        />
      ) : (
        <div>{fallBackTemplate}</div>
      )}
    </>
  );
};

export default NovaImage;
