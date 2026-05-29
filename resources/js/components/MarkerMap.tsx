import {Image} from "react-konva";
import {useState, useEffect} from "react";
import {useNavigate} from "@tanstack/react-router";
import {Route, UtilityCoordinates} from "@/routes/maps/$mapName";

type MarkerProps = {
    start: UtilityCoordinates,
    end: UtilityCoordinates,
}

export function MarkerMap({props} : {props: MarkerProps}) {
    const [image, setImage] = useState<HTMLImageElement | undefined>();
    const {mapName} = Route.useParams();
    const navigate = useNavigate();
    useEffect(() => {
        const img = new window.Image();
        img.src = `/storage/${props.start.image}`;
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
                        utilityId: String(props.start.utility_id),
                        mapName: mapName
                    }
                }).then();
            }}
        />
    )

}
