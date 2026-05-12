import {Image} from "react-konva";
import {useState, useEffect} from "react";

export function MarkerMap({props}) {
    const [image, setImage] = useState<HTMLImageElement | undefined>();

    useEffect(() => {
        const img = new window.Image();
        img.src = `/storage/${props.start.utility_image}`;
        img.onload = () => setImage(img);
    }, [props]);
    return (
        <Image
            image={image!}
            x={Number(props.start.x)}
            y={Number(props.start.y)}
            width={50}
            height={50}
            offsetX={25}
            offsetY={25}
        />
    )

}
