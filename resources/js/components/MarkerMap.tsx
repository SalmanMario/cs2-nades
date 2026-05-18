import {Image} from "react-konva";
import {useState, useEffect} from "react";
import {useNavigate} from "@tanstack/react-router";

export function MarkerMap({props}) {
    const [image, setImage] = useState<HTMLImageElement | undefined>();
    const navigate = useNavigate();
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
            onClick={() => {
                navigate({
                    to: "/maps/$mapName/$utilityId",
                    params: {
                        utilityId: props.start.utility_id,
                    }
                })
            }}
        />
    )

}
