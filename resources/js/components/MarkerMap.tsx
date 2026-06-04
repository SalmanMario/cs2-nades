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
    const [isHovered, setIsHovered] = useState<boolean>(false);
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
            onMouseEnter={(e) => {
                const stage = e.target.getStage();
                if (stage) {
                    stage.container().style.cursor = "pointer"
                    setIsHovered(true);
                }
            }}
            onMouseLeave={(e) => {
                const stage = e.target.getStage();
                if (stage) {
                    stage.container().style.cursor = "default";
                    setIsHovered(false);
                }
            }}
            width={50}
            height={50}
            scaleX={isHovered ? 1.25 : 1}
            scaleY={isHovered ? 1.25 : 1}
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
