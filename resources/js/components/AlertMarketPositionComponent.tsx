import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AlertMarketPositionComponent({position} : {position: {x: number, y: number}}) {
    return (
        <div className="fixed top-20 right-15 w-64 z-50">
            <Alert>
                <AlertTitle>Marker Position</AlertTitle>
                <AlertDescription>
                    <p>Position X: {position.x.toFixed(2)}</p>
                    <p>Position Y: {position.y.toFixed(2)}</p>
                </AlertDescription>
            </Alert>
        </div>
    )
}
